interface MessageRequest {
  action: string;
}

interface AuthResponse {
  authHeader: string | null;
  url?: string;
  timestamp?: number;
}

// ポップアップからのメッセージを監視
chrome.runtime.onMessage.addListener((request: MessageRequest, _sender, sendResponse) => {
  if (request.action === 'getAuthHeader') {
    // バックグラウンドスクリプトから保存されたAuthorizationヘッダーを取得
    chrome.runtime.sendMessage({ action: 'getStoredAuthHeader' }, (response: AuthResponse) => {
      if (response && response.authHeader) {
        sendResponse({ authHeader: response.authHeader });
      } else {
        // 代替方法: 現在のページのFetchリクエストを監視
        sendResponse({ 
          authHeader: 'このページではまだAuthorizationヘッダーが検出されていません。ページでAPIリクエストを実行してから再試行してください。' 
        });
      }
    });

    // 非同期レスポンスのためにtrueを返す
    return true;
  }
});

// ページ上のFetch/XMLHttpRequestを監視（オプション）
(() => {
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // Fetchの監視
  window.fetch = function (...args: Parameters<typeof fetch>) {
    const options = args[1] || {};

    if (options.headers) {
      const headers = new Headers(options.headers);
      const authHeader = headers.get('Authorization');
      if (authHeader) {
        console.log('Authorization header detected in fetch:', authHeader);
      }
    }

    return originalFetch.apply(this, args);
  };

  // XMLHttpRequestの監視
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null) {
    (this as any)._method = method;
    (this as any)._url = url;
    return originalXHROpen.call(this, method, url, async ?? true, username, password);
  };

  XMLHttpRequest.prototype.send = function (...args: Parameters<XMLHttpRequest['send']>) {
    // リクエストヘッダーをチェック
    try {
      const authHeader = this.getResponseHeader && this.getResponseHeader('Authorization');
      if (authHeader) {
        console.log('Authorization header detected in XHR:', authHeader);
      }
    } catch (error) {
      // getResponseHeaderは送信前には使用できないため、エラーは無視
    }

    return originalXHRSend.apply(this, args);
  };
})();
