interface MessageResponse {
  authHeader?: string;
}

document.addEventListener('DOMContentLoaded', () => {
  const getAuthHeaderBtn = document.getElementById('getAuthHeader') as HTMLButtonElement;
  const clearResultBtn = document.getElementById('clearResult') as HTMLButtonElement;
  const copyAuthBtn = document.getElementById('copyAuth') as HTMLButtonElement;
  const copyJsonBtn = document.getElementById('copyJson') as HTMLButtonElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;
  const authValueDiv = document.getElementById('authValue') as HTMLDivElement;
  const timestampDiv = document.getElementById('timestamp') as HTMLDivElement;
  const urlDiv = document.getElementById('url') as HTMLDivElement;

  getAuthHeaderBtn.addEventListener('click', async () => {
    try {
      // アクティブなタブを取得
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.id) {
        showResult('エラー: タブIDが取得できませんでした', '', '');
        return;
      }

      // コンテンツスクリプトにメッセージを送信
      chrome.tabs.sendMessage(tab.id, { action: 'getAuthHeader' }, (response: MessageResponse) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          showResult('エラー: コンテンツスクリプトとの通信に失敗しました', '', tab.url || '');
          return;
        }

        if (response && response.authHeader) {
          showResult(response.authHeader, new Date().toLocaleString('ja-JP'), tab.url || '');
        } else {
          showResult('Authorization ヘッダーが見つかりませんでした', new Date().toLocaleString('ja-JP'), tab.url || '');
        }
      });
    } catch (error) {
      console.error('Error getting auth header:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showResult('エラー: ' + errorMessage, new Date().toLocaleString('ja-JP'), '');
    }
  });

  clearResultBtn.addEventListener('click', () => {
    resultDiv.style.display = 'none';
    authValueDiv.textContent = '';
    timestampDiv.textContent = '';
    urlDiv.textContent = '';
  });

  copyAuthBtn.addEventListener('click', async () => {
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

  copyJsonBtn.addEventListener('click', async () => {
    try {
      const authHeader = authValueDiv.textContent;
      if (authHeader && authHeader !== 'Authorization ヘッダーが見つかりませんでした' && !authHeader.startsWith('エラー:')) {
        const jsonObject = { "Authorization": authHeader };
        const jsonString = JSON.stringify(jsonObject, null, 2);
        await navigator.clipboard.writeText(jsonString);

        // ボタンのテキストを一時的に変更してフィードバックを提供
        const originalText = copyJsonBtn.textContent;
        copyJsonBtn.textContent = 'コピーしました！';
        copyJsonBtn.disabled = true;

        setTimeout(() => {
          copyJsonBtn.textContent = originalText;
          copyJsonBtn.disabled = false;
        }, 2000);
      } else {
        alert('コピーできる有効なAuthorizationヘッダーがありません');
      }
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error);
      alert('クリップボードへのコピーに失敗しました');
    }
  });

  function showResult(authHeader: string, timestamp: string, url: string): void {
    authValueDiv.textContent = authHeader;
    timestampDiv.textContent = timestamp;
    urlDiv.textContent = url;
    resultDiv.style.display = 'block';

    // コピーボタンの表示制御
    if (authHeader && authHeader !== 'Authorization ヘッダーが見つかりませんでした' && !authHeader.startsWith('エラー:')) {
      copyAuthBtn.style.display = 'block';
      copyJsonBtn.style.display = 'block';
    } else {
      copyAuthBtn.style.display = 'none';
      copyJsonBtn.style.display = 'none';
    }
  }
});
