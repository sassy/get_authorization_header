interface AuthData {
  value: string;
  url: string;
  timestamp: number;
}

interface MessageRequest {
  action: string;
}

interface AuthResponse {
  authHeader: string | null;
  url?: string;
  timestamp?: number;
}

// HTTPリクエストヘッダーを監視してAuthorizationヘッダーを保存
const authHeaders = new Map<number, AuthData>();

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details: chrome.webRequest.WebRequestHeadersDetails) => {
    if (details.requestHeaders) {
      for (const header of details.requestHeaders) {
        if (header.name.toLowerCase() === 'authorization' && header.value) {
          // タブIDをキーとしてAuthorizationヘッダーを保存
          authHeaders.set(details.tabId, {
            value: header.value,
            url: details.url,
            timestamp: Date.now()
          });
          break;
        }
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

// コンテンツスクリプトからのメッセージを処理
chrome.runtime.onMessage.addListener((request: MessageRequest, sender: chrome.runtime.MessageSender, sendResponse: (response: AuthResponse) => void) => {
  if (request.action === 'getStoredAuthHeader') {
    const tabId = sender.tab?.id;
    
    if (tabId !== undefined) {
      const authData = authHeaders.get(tabId);

      if (authData) {
        sendResponse({
          authHeader: authData.value,
          url: authData.url,
          timestamp: authData.timestamp
        });
      } else {
        sendResponse({ authHeader: null });
      }
    } else {
      sendResponse({ authHeader: null });
    }
  }
});

// タブが閉じられたときにデータをクリーンアップ
chrome.tabs.onRemoved.addListener((tabId: number) => {
  authHeaders.delete(tabId);
});
