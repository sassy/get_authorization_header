document.addEventListener('DOMContentLoaded', function () {
    const getAuthHeaderBtn = document.getElementById('getAuthHeader');
    const clearResultBtn = document.getElementById('clearResult');
    const copyAuthBtn = document.getElementById('copyAuth');
    const resultDiv = document.getElementById('result');
    const authValueDiv = document.getElementById('authValue');
    const timestampDiv = document.getElementById('timestamp');
    const urlDiv = document.getElementById('url');

    getAuthHeaderBtn.addEventListener('click', async function () {
        try {
            // アクティブなタブを取得
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // コンテンツスクリプトにメッセージを送信
            chrome.tabs.sendMessage(tab.id, { action: 'getAuthHeader' }, function (response) {
                if (chrome.runtime.lastError) {
                    console.error('Error:', chrome.runtime.lastError);
                    showResult('エラー: コンテンツスクリプトとの通信に失敗しました', '', tab.url);
                    return;
                }

                if (response && response.authHeader) {
                    showResult(response.authHeader, new Date().toLocaleString('ja-JP'), tab.url);
                } else {
                    showResult('Authorization ヘッダーが見つかりませんでした', new Date().toLocaleString('ja-JP'), tab.url);
                }
            });
        } catch (error) {
            console.error('Error getting auth header:', error);
            showResult('エラー: ' + error.message, new Date().toLocaleString('ja-JP'), '');
        }
    });

    clearResultBtn.addEventListener('click', function () {
        resultDiv.style.display = 'none';
        authValueDiv.textContent = '';
        timestampDiv.textContent = '';
        urlDiv.textContent = '';
    });

    copyAuthBtn.addEventListener('click', async function () {
        try {
            const authHeader = authValueDiv.textContent;
            if (authHeader && authHeader !== 'Authorization ヘッダーが見つかりませんでした' && !authHeader.startsWith('エラー:')) {
                await navigator.clipboard.writeText(authHeader);

                // ボタンのテキストを一時的に変更してフィードバックを提供
                const originalText = copyAuthBtn.textContent;
                copyAuthBtn.textContent = 'コピーしました！';
                copyAuthBtn.disabled = true;

                setTimeout(() => {
                    copyAuthBtn.textContent = originalText;
                    copyAuthBtn.disabled = false;
                }, 2000);
            } else {
                alert('コピーできる有効なAuthorizationヘッダーがありません');
            }
        } catch (error) {
            console.error('クリップボードへのコピーに失敗しました:', error);
            alert('クリップボードへのコピーに失敗しました');
        }
    });

    function showResult(authHeader, timestamp, url) {
        authValueDiv.textContent = authHeader;
        timestampDiv.textContent = timestamp;
        urlDiv.textContent = url;
        resultDiv.style.display = 'block';

        // コピーボタンの表示制御
        if (authHeader && authHeader !== 'Authorization ヘッダーが見つかりませんでした' && !authHeader.startsWith('エラー:')) {
            copyAuthBtn.style.display = 'block';
        } else {
            copyAuthBtn.style.display = 'none';
        }
    }
});
