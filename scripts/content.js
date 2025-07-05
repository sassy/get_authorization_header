// ポップアップからのメッセージを監視
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAuthHeader') {
        // バックグラウンドスクリプトから保存されたAuthorizationヘッダーを取得
        chrome.runtime.sendMessage({ action: 'getStoredAuthHeader' }, (response) => {
            if (response && response.authHeader) {
                sendResponse({ authHeader: response.authHeader });
            } else {
                // 代替方法: 現在のページのFetchリクエストを監視
                sendResponse({ authHeader: 'このページではまだAuthorizationヘッダーが検出されていません。ページでAPIリクエストを実行してから再試行してください。' });
            }
        });

        // 非同期レスポンスのためにtrueを返す
        return true;
    }
});

// ページ上のFetch/XMLHttpRequestを監視（オプション）
(function () {
    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    // Fetchの監視
    window.fetch = function (...args) {
        const request = args[0];
        const options = args[1] || {};

        if (options.headers && options.headers.Authorization) {
            console.log('Authorization header detected in fetch:', options.headers.Authorization);
        }

        return originalFetch.apply(this, args);
    };

    // XMLHttpRequestの監視
    XMLHttpRequest.prototype.open = function (...args) {
        this._method = args[0];
        this._url = args[1];
        return originalXHROpen.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        // リクエストヘッダーをチェック
        const authHeader = this.getRequestHeader && this.getRequestHeader('Authorization');
        if (authHeader) {
            console.log('Authorization header detected in XHR:', authHeader);
        }

        return originalXHRSend.apply(this, args);
    };
})();