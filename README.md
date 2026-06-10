# 說書機 md-audio

把 Markdown／純文字檔用文字轉語音（TTS）唸出來的單檔 PWA——一台吃 `.md` 的有聲書播放器。

**線上版**：https://scandnavik.github.io/md-audio/

## 特色

- **單檔零依賴**：核心就是一個 `index.html`，無後端、無框架、無建置流程
- **BYOK（Bring Your Own Key）**：OpenAI API key 只存在你瀏覽器的 localStorage，播放時由你的瀏覽器直連 OpenAI，不經過任何中間伺服器；本 repo 不含任何金鑰
- **免費試用路徑**：沒有 key 也能用瀏覽器內建語音（Web Speech API）
- **語音快取**：合成過的段落存 IndexedDB，重播／重開不重複收費
- **書庫＋續聽**：載入過的文件自動進書庫，記住每篇聽到第幾段，重開接著聽
- **手機體驗**：可安裝成 App（PWA）、鎖屏播放控制（mediaSession）、深色 UI

## 使用

1. 開 https://scandnavik.github.io/md-audio/ （或本地直接開 `index.html`）
2. 「語音設定」填入 OpenAI API key（或切到瀏覽器內建引擎免 key 試聽）
3. 選 `.md`／`.txt` 檔、拖曳或貼上文字 → 載入並切段 → 按播放
4. 手機瀏覽器選「加到主畫面」即可裝成 App

## 成本參考

以字數計費：幾千字文章約 NT$1 上下；五萬字書 `tts-1` 約 NT$20–30、`tts-1-hd` 約兩倍。快取後重播免費。

## 架構備註

- TTS provider 已抽象（`synthOpenAI()` / `speakBrowser()` 兩條路徑，由設定切換），要加 Azure／ElevenLabs 等只需新增一個 `synthXxx()` 接上
- 快取 key：`v1|model|voice|speed|instructions|sha1(text)`，任一設定改變視為新版本
- `sw.js` 只快取同網域 App 殼，TTS API 請求一律放行
