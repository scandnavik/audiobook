# Audiobook｜有聲書

把 EPUB／Markdown／純文字用文字轉語音（TTS）唸出來的單檔 PWA——有聲書播放器。書籍首選 `.epub`（內建解析，零依賴），`.md`／`.txt` 備選。

**線上版**：https://scandnavik.github.io/audiobook/

## 特色

- **單檔零依賴**：核心就是一個 `index.html`，無後端、無框架、無建置流程
- **內建 EPUB 解析**：瀏覽器原生 `DecompressionStream` 解 ZIP＋DOMParser 抽正文（依 spine 順序、標題補停頓、剝表格／註腳），不引入任何函式庫
- **BYOK（Bring Your Own Key）**：三家雲端引擎（OpenAI／Google Cloud／Azure）任選，key 只存在你瀏覽器的 localStorage、各家分開記住，播放時由你的瀏覽器直連該引擎，不經過任何中間伺服器；本 repo 不含任何金鑰
- **免費試用路徑**：沒有 key 也能用瀏覽器內建語音（Web Speech API）
- **語音快取**：合成過的段落存 IndexedDB，重播／重開不重複收費
- **書庫＋續聽**：載入過的文件自動進書庫，記住每篇聽到第幾段，重開接著聽
- **重點＋筆記**：播放中一鍵標記現在唸到的句子、或直接在文字上選取畫重點，重點可附筆記；全部可匯出成 Markdown（下載或複製），直接餵進你的知識庫
- **整本匯出音檔**：一鍵把整本書合成下載（按章節分檔打包 zip），已聽過的段落直接用快取、不重複收費；匯出前先告訴你預估費用／大小／時間
- **語系＋聲色**：可選語系（中文台灣／通用、英、日、韓）與男聲／女聲，自動篩選兩個引擎的音色清單
- **手機體驗**：可安裝成 App（PWA）、鎖屏播放控制（mediaSession）、深色 UI

## 使用

1. 開 https://scandnavik.github.io/audiobook/ （或本地直接開 `index.html`）
2. 「語音設定」選引擎（OpenAI／Google Cloud／Azure／Gemini）並填該家的 key（或切到瀏覽器內建引擎免 key 試聽），key 來源見下方「API key 怎麼拿」
3. 選 `.epub`／`.md`／`.txt` 檔、拖曳或貼上文字 → 載入並切段 → 按播放
4. 聽到想記的句子按播放列的「標記」鈕（或在文字上選取後點「標重點」）；「重點」分頁可匯出 Markdown。整本下載音檔用段落清單上方的「匯出音檔」。
5. 手機安裝成 App 的步驟見下一節

## API key 怎麼拿

| 引擎 | 取得方式 |
|------|---------|
| OpenAI | platform.openai.com → API keys，`sk-` 開頭 |
| Google Cloud | GCP 主控台（console.cloud.google.com）→ 啟用 **Cloud Text-to-Speech API** → 建立 API key。需要 GCP 專案＋綁帳單（免費額度照樣享有：每月 100 萬字元，Wavenet／Standard 到 400 萬） |
| Azure | portal.azure.com → 建立 **Speech** 資源 → 「金鑰與端點」拿 key 和 region（台灣常用 `eastasia`） |
| Gemini | aistudio.google.com → Get API key，免費、不用綁帳單 |

### ⚠️ AI Studio key 特別說明

**AI Studio（aistudio.google.com）拿的 key 不能用在「Google Cloud」引擎。** 它們是 Google 兩個不同的服務：

- AI Studio key 屬於 **Gemini API**（`generativelanguage.googleapis.com`）→ 請選「**Gemini**」引擎，填進 Gemini API Key 欄位，立刻能用、有免費層
- 「Google Cloud」引擎打的是 **Cloud Text-to-Speech**（`texttospeech.googleapis.com`）→ 需要上表的 GCP 專案 key

填錯的症狀：播放時跳「Google: 403／API not enabled」之類的錯誤。兩種 key 都是 `AIza` 開頭、外觀無法區分，請以來源網站判斷。

計費差異也要知道：Gemini 引擎按**音訊時長**計費（超出免費層後一本五萬字書約 NT$85–95），Google Cloud 引擎按**字數**計費（月免費額度內 $0，超出約 NT$6–25／本）。輕量試聽用 Gemini 最快上手，重度聽書值得辦一把 GCP key。

## 安裝到手機桌面（變成 App）

### iOS（iPhone／iPad）

1. 用 **Safari** 開 https://scandnavik.github.io/audiobook/ （建議用 Safari，最穩；LINE／FB 的內建瀏覽器不行，要先點「用 Safari 開啟」）
2. 點底部工具列中間的**分享按鈕**（方框加向上箭頭）
3. 選單往下捲，點「**加入主畫面**」
4. 名稱保持「有聲書」→ 右上角「**新增**」
5. 桌面出現 icon，點開就是全螢幕 App（沒有網址列）

iOS 兩個注意事項：

- **一定要裝**：iOS 對「一般網站」的本機資料有七天未使用就清除的政策——書庫、續聽進度、語音快取、API key 都會被清掉。裝成主畫面 App 之後**豁免**，資料永久保留。
- **儲存空間是分開的**：iOS 的主畫面 App 和 Safari 不共用資料。如果你先在 Safari 裡填了 key、聽了幾本書，裝成 App 後要**重新填一次 key**，書庫也是從零開始——所以建議一開始就裝好 App 再開始用。
- **鎖屏時無法標記重點**：系統鎖屏播放控制（mediaSession）只開放標準播放鍵，無法加自訂按鈕——標記要回 App 內按。

### Android

1. 用 **Chrome** 開 https://scandnavik.github.io/audiobook/
2. 兩條路任選：
   - App 標題列若出現**下載 icon（安裝鈕）**，直接點它
   - 或右上角 **⋮ 選單** → 「**加入主畫面**」（部分版本顯示「安裝應用程式」）
3. 確認安裝 → icon 出現在桌面和 App 抽屜，點開全螢幕執行
4. 用三星瀏覽器（Samsung Internet）的話：底部**選單** → 「**新增頁面至**」 → 「**主畫面**」

Android 注意事項：

- 安裝後的 App 和 Chrome **共用同一份資料**——Chrome 裡填過的 key、聽到一半的書，裝完直接延續，不用重來。
- 鎖屏播放控制（播放／暫停／上下段、顯示書名章節）裝成 App 後體驗最完整。

### 電腦（Windows／macOS）

1. 用 **Chrome 或 Edge** 開 https://scandnavik.github.io/audiobook/
2. 點**網址列右側的「安裝」圖示**（螢幕加向下箭頭；Edge 部分版本在 ⋯ 選單 → 「應用程式」 → 「安裝此網站為應用程式」）
3. 確認安裝 → 變成獨立視窗 App，Windows 會進開始功能表（可釘選工作列）、macOS 進啟動台
4. macOS 用 Safari 的話：**檔案** → 「**加入 Dock**」（Safari 17 以上）

電腦版說明：

- 和 Android 一樣，**裝完與瀏覽器共用同一份資料**，key、書庫、續聽進度直接延續。
- 日常使用和手機相同：選檔或**直接從檔案總管把 `.epub`／`.md` 拖進視窗**就開始聽，邊工作邊聽最方便。
- 媒體鍵（鍵盤的播放／暫停鍵、藍牙耳機按鍵）可以控制播放，掛後台聽沒問題。
- **不裝也完全能用**——電腦上直接開網址聽即可，安裝只是多一個獨立視窗和捷徑。
- 想完全本地跑：clone repo 後雙擊 `index.html` 就能開（`file://` 模式下書庫與快取照常運作，但無法安裝成 App；少數瀏覽器可能擋雲端 API，遇到就改用線上版或 `npx serve`）。

## TTS 模型與費率比較（2026-06 查證）

App 的 provider 層已抽象成插座（`synthXxx()` 一個函式一個引擎），下表是未來可插拔的候選。本 App 無後端，**能不能純前端 BYOK 直連（CORS）是硬門檻**。

以「一本五萬字中文書」估算（USD→NT$ 以 31.5 計，快取後重播一律免費）：

| 引擎／模型 | 官方費率 | 五萬字書約 | 純前端直連 | 備註 |
|-----------|---------|-----------|:---:|------|
| **OpenAI `tts-1`**（現役） | $15／百萬字元 | **NT$24** | ✅ | 按字計費，中文一字一音節最划算 |
| **OpenAI `tts-1-hd`**（現役） | $30／百萬字元 | NT$47 | ✅ | 音質升級版 |
| **OpenAI `gpt-4o-mini-tts`**（現役） | $0.6／1M 輸入 token＋$12／1M 音訊 token（≈$0.015／分鐘） | NT$85–95 | ✅ | 唯一吃語氣指示（口音控制靠它）；**按時計費，中文長書反而貴** |
| **Azure 標準 neural**（現役） | $15／百萬字元 | NT$24 | ✅ | 台灣中文音色最齊（曉臻、曉雨、雲哲），REST＋key header |
| Azure neural HD | $22／百萬字元（2026-03 降價） | NT$35 | ✅ | 最像真人的中文選項之一 |
| **Google Cloud**（現役） | Neural2 $16／Wavenet $4／百萬字元 | NT$6–25 | ✅ | **每月前 100 萬字元免費**（Wavenet 到 400 萬）＝月聽 20 本書不用錢；台灣音色為 cmn-TW Wavenet |
| Google Cloud Chirp 3 HD | $30／百萬字元 | NT$47 | ✅ | 同上享每月 100 萬字元免費額度 |
| **Gemini Flash TTS**（現役） | $10／1M 音訊 token（25 token／秒 ≈ $0.9／小時） | NT$85–95 | ✅ | **AI Studio key 直接用**，有免費層（限流）；按時計費，適合試聽與輕量使用 |
| ElevenLabs | API 約 $60–120／百萬字元（依方案） | NT$95–190＋月費 | ✅ | 音質天花板但中文普通，最貴 |
| Amazon Polly neural | $19.2／百萬字元 | NT$30 | ❌ | 要 SigV4 簽章，純前端不可行 |
| Edge TTS | 免費 | $0 | ❌ | 非官方協定、需代理、隨時可斷 |
| 瀏覽器內建（現役 fallback） | 免費 | $0 | ✅ | 可離線，自然度看機型 |

**選型結論**：中文長書聽量大，**按字計費完勝按時計費**（中文字密度高）。預設 `tts-1` 已是性價比前緣；下一個最值得插的是 **Google Cloud Neural2**（每月 100 萬字元免費額度直接覆蓋重度使用）與 **Azure neural**（台灣腔音色最齊）。

費率來源：[OpenAI Pricing](https://openai.com/api/pricing/)、[Azure Speech Pricing](https://azure.microsoft.com/en-us/pricing/details/speech/)、[Google Cloud TTS Pricing](https://cloud.google.com/text-to-speech/pricing)、[Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)、[ElevenLabs API Pricing](https://elevenlabs.io/pricing/api)、[Amazon Polly Pricing](https://aws.amazon.com/polly/pricing/)。

## 架構備註

- TTS provider 走註冊表（`PROVIDERS`）：每家＝一筆 `{label, voices, synth}`＋一個 `synthXxxOne()`，加新引擎只需加表項＋合成函式＋一組 key 欄位（HTML `data-p` 標記）
- 各家單次請求上限不同（Google 約 5000 bytes、Azure 10 分鐘音訊），`synthChunked()` 超限自動依句切塊、逐塊合成後串接 MP3
- 快取 key：`v2|provider|model|voice|speed|instructions|sha1(text)`，任一設定改變視為新版本，不同引擎互不污染
- `sw.js` 只快取同網域 App 殼，TTS API 請求一律放行
- 重點筆記存 IndexedDB `marks` store（錨點＝段索引＋字元偏移＋原文快照），刪書連動刪除；匯出 MD 為 frontmatter＋章節分組＋blockquote 引文
- 整本匯出：批次佇列（併發 2、單段重試、取消＝斷點續傳）→ 章級組裝（MP3 直串／Gemini 合併 PCM 重包 WAV）→ 手寫 ZIP writer（store 模式）打包下載

## 版本紀錄

見 [CHANGELOG.md](CHANGELOG.md)。
