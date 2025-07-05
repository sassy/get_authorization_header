// HTTPリクエストヘッダーを監視してAuthorizationヘッダーを保存
let authHeaders = new Map();

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.requestHeaders) {
            for (let header of details.requestHeaders) {
                if (header.name.toLowerCase() === 'authorization') {
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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getStoredAuthHeader') {
        const tabId = sender.tab.id;
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
    }
});

// タブが閉じられたときにデータをクリーンアップ
chrome.tabs.onRemoved.addListener((tabId) => {
    authHeaders.delete(tabId);
});
