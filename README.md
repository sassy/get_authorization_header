# Get Author1. Chrome拡張機能の開発者モードを有効にする
   - Chromeのアドレスバーに`chrome://extensions/`と入力
   - 右上の「開発者モード」を有効にする

2. 拡張機能をロードする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - このプロジェクトのフォルダーを選択 Header - Chrome Extension

このChrome拡張機能は、ウェブページで送信されるHTTPリクエストのAuthorizationヘッダーを取得するためのツールです。

## 機能

- ウェブページで発生するHTTPリクエストのAuthorizationヘッダーを監視
- 拡張機能のポップアップから簡単にAuthorizationヘッダーを確認
- 取得したヘッダー情報の表示（値、URL、取得時刻）

## インストール方法

1. Chrome拡張機能の開発者モードを有効にする
   - Chrome のアドレスバーに `chrome://extensions/` と入力
   - 右上の「開発者モード」を有効にする

2. 拡張機能をロードする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - このプロジェクトのフォルダを選択

3. アイコンの準備
   - `generate_icon.html` をブラウザで開いて `hello_extensions.png` をダウンロード
   - ダウンロードしたファイルをプロジェクトのルートディレクトリに配置

## 使用方法

1. 拡張機能がインストールされたら、ブラウザのツールバーにアイコンが表示されます
2. Authorizationヘッダーを含むAPIリクエストが発生するウェブページを開きます
3. 拡張機能のアイコンをクリックしてポップアップを開きます
4. 「AuthorizationHeaderを取得」ボタンをクリックします
5. 検出されたAuthorizationヘッダーが表示されます

## ファイル構成

```
/
├── manifest.json          # 拡張機能の設定ファイル
├── hello.html             # ポップアップのHTML
├── generate_icon.html     # アイコン生成用HTML
├── scripts/
│   ├── popup.js          # ポップアップのJavaScript
│   ├── content.js        # コンテンツスクリプト
│   └── background.js     # バックグラウンドスクリプト
└── README.md             # このファイル
```

## 技術仕様

- Manifest V3対応
- 必要な権限：`activeTab`, `webRequest`, `<all_urls>`
- HTTPリクエストの監視にはWebRequest APIを使用
- コンテンツスクリプトとバックグラウンドスクリプト間でメッセージング

## 注意事項

- この拡張機能はHTTPSサイトでのみ完全に動作します
- Authorizationヘッダーは機密情報のため、取得した情報の取り扱いには注意してください
- 一部のサイトでは、Content Security Policy (CSP) により制限される場合があります

## 開発者向け

拡張機能を開発・カスタマイズする場合は、以下のファイルを編集してください：

- `manifest.json`: 権限や設定の変更
- `scripts/background.js`: HTTPリクエスト監視ロジックの変更
- `scripts/popup.js`: ポップアップUIの動作変更
- `hello.html`: ポップアップUIのデザイン変更
