# Get Authorization Header - Chrome Extension

このChrome拡張機能は、ウェブページで送信されるHTTPリクエストのAuthorizationヘッダーを取得し、クリップボードにコピーするためのツールです。

## 機能

- ウェブページで発生するHTTPリクエストのAuthorizationヘッダーを監視
- 拡張機能のポップアップから簡単にAuthorizationヘッダーを確認
- 取得したヘッダー情報の表示（値、URL、取得時刻）
- Authorizationヘッダーをクリップボードにワンクリックでコピー

## 開発環境

このプロジェクトはTypeScriptで開発されており、以下の技術スタックを使用しています：

- **TypeScript**: 型安全なJavaScript開発
- **Vite**: 高速なビルドツール
- **Yarn**: パッケージマネージャー
- **@types/chrome**: Chrome拡張機能API用の型定義

## セットアップ

### 開発環境の準備

1. 依存関係をインストール:
   ```bash
   yarn install
   ```

2. プロジェクトをビルド:
   ```bash
   yarn build
   ```

3. 開発モード（ファイル変更を監視）:
   ```bash
   yarn dev
   ```

### Chrome拡張機能としてインストール

1. Chrome拡張機能の開発者モードを有効にする
   - Chromeのアドレスバーに`chrome://extensions/`と入力
   - 右上の「開発者モード」を有効にする

2. 拡張機能をロードする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `dist`フォルダーを選択

## 使用方法

1. 拡張機能がインストールされたら、ブラウザのツールバーにアイコンが表示されます
2. Authorizationヘッダーを含むAPIリクエストが発生するウェブページを開きます
3. 拡張機能のアイコンをクリックしてポップアップを開きます
4. 「Authorization Headerを取得」ボタンをクリックします
5. 検出されたAuthorizationヘッダーが表示されます
6. 「クリップボードにコピー」ボタンでヘッダーをコピーできます

## ファイル構成

```
/
├── src/                      # TypeScriptソースファイル
│   ├── manifest.json        # 拡張機能の設定ファイル
│   ├── popup.html           # ポップアップのHTML
│   ├── popup.ts             # ポップアップのTypeScript
│   ├── content.ts           # コンテンツスクリプト
│   ├── background.ts        # バックグラウンドスクリプト
│   └── hello_extensions.svg # 拡張機能のアイコン
├── dist/                     # ビルド成果物（Chrome拡張機能）
├── package.json             # プロジェクト設定
├── tsconfig.json            # TypeScript設定
├── vite.config.ts           # Viteビルド設定
└── README.md                # このファイル
```

## 開発者向け

### 利用可能なスクリプト

- `yarn build`: プロダクション用にビルド
- `yarn dev`: 開発モード（ファイル変更を監視してリビルド）
- `yarn type-check`: TypeScriptの型チェックのみ実行

### 開発フロー

1. TypeScriptファイル（`src/`ディレクトリ内）を編集
2. `yarn build`または`yarn dev`でビルド
3. Chrome拡張機能管理画面で拡張機能を更新
4. 動作確認

## 技術仕様

- Manifest V3対応
- TypeScriptで型安全な開発
- Viteによる高速ビルド
- 必要な権限：`activeTab`, `webRequest`, `clipboardWrite`, `<all_urls>`
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
