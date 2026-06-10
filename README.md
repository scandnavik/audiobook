# 說書機 audiobook

把 EPUB／Markdown／純文字用文字轉語音（TTS）唸出來的單檔 PWA——有聲書播放器。書籍首選 `.epub`（內建解析，零依賴），`.md`／`.txt` 備選。

**線上版**：https://scandnavik.github.io/audiobook/

## 特色

- **單檔零依賴**：核心就是一個 `index.html`，無後端、無框架、無建置流程
- **內建 EPUB 解析**：瀏覽器原生 `DecompressionStream` 解 ZIP＋DOMParser 抽正文（依 spine 順序、標題補停頓、剝表格／註腳），不引入任何函式庫
- **BYOK（Bring Your Own Key）**：三家雲端引擎（OpenAI／Google Cloud／Azure）任選，key 只存在你瀏覽器的 localStorage、各家分開記住，播放時由你的瀏覽器直連該引擎，不經過任何中間伺服器；本 repo 不含任何金鑰
- **免費試用路徑**：沒有 key 也能用瀏覽器內建語音（Web Speech API）
- **語音快取**：合成過的段落存 IndexedDB，重播／重開不重複收費
- **書庫＋續聽**：載入過的文件自動進書庫，記住每篇聽到第幾段，重開接著聽
- **語系＋聲色**：可選語系（中文台灣／通用、英、日、韓）與男聲／女聲，自動篩選兩個引擎的音色清單
- **手機體驗**：可安裝成 App（PWA）、鎖屏播放控制（mediaSession）、深色 UI

## 使用

1. 開 https://scandnavik.github.io/audiobook/ （或本地直接開 `index.html`）
2. 「語音設定」選引擎（OpenAI／Google Cloud／Azure）並填該家的 key（或切到瀏覽器內建引擎免 key 試聽）
3. 選 `.epub`／`.md`／`.txt` 檔、拖曳或貼上文字 → 載入並切段 → 按播放
4. 手機安裝成 App 的步驟見下一節

## 安裝到手機桌面（變成 App）

### iOS（iPhone／iPad）

1. 用 **Safari** 開 https://scandnavik.github.io/audiobook/ （建議用 Safari，最穩；LINE／FB 的內建瀏覽器不行，要先點「用 Safari 開啟」）
2. 點底部工具列中間的**分享按鈕**（方框加向上箭頭）
3. 選單往下捲，點「**加入主畫面**」
4. 名稱保持「說書機」→ 右上角「**新增**」
5. 桌面出現 icon，點開就是全螢幕 App（沒有網址列）

iOS 兩個注意事項：

- **一定要裝**：iOS 對「一般網站」的本機資料有七天未使用就清除的政策——書庫、續聽進度、語音快取、API key 都會被清掉。裝成主畫面 App 之後**豁免**，資料永久保留。
- **儲存空間是分開的**：iOS 的主畫面 App 和 Safari 不共用資料。如果你先在 Safari 裡填了 key、聽了幾本書，裝成 App 後要**重新填一次 key**，書庫也是從零開始——所以建議一開始就裝好 App 再開始用。

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

## 版本紀錄

### v0.8（2026-06-10）— Gemini TTS 引擎＋電腦端教學

- **Gemini 引擎**：AI Studio 的 key 直接可用（解決「AI Studio key 打不了 Cloud TTS」的門檻），有免費層；2.5 Flash TTS／3.1 Flash TTS preview 雙模型、8 個多語音色
- 技術：`generateContent` 回 base64 PCM，`pcmToWav()` 包 WAV 頭播放；分塊時合併 PCM 再包頭（WAV 不能像 MP3 直接串接）
- Gemini 沒有語速參數，改在播放端 `playbackRate` 調（保持音高），換語速不重新合成、不重複計費
- 模型欄動態化：各引擎自帶模型清單，沒有的（Google／Azure）自動隱藏
- README：新增電腦（Windows／macOS）安裝成 App 與桌面使用說明

### v0.7（2026-06-10）— 多引擎插座：Google Cloud＋Azure 上線

- **Provider 註冊表**：引擎抽象成「一筆設定＋一個 `synthXxxOne()`」，設定面板依所選引擎動態顯示欄位，之後加新引擎不再動 UI
- **Google Cloud TTS**：REST＋API key 直連，台灣音色 cmn-TW Wavenet 系列；每月前 100 萬字元免費（Wavenet／Standard 到 400 萬），一般聽量全程免費
- **Azure Speech**：REST＋key＋region 直連，台灣腔 neural 音色（曉臻／曉雨／雲哲）＋普通話（曉曉／雲希／雲揚）
- **各家請求上限自動分塊**：Google 單次約 5000 bytes、Azure 上限 10 分鐘音訊——超限時內部依句切塊逐塊合成、串接成單一 MP3，使用者無感
- **各家 key 分開存**、各引擎記住自己上次選的音色／模型，切換引擎不互蓋、不重填
- **快取 key 升 v2**（加 provider 維度），不同引擎的語音快取不互撞；⚠️ 既有快取因此失效一次
- 語系／聲色篩選接上各家音色表（Google／Azure 直接有語系專屬音色，不再依賴語氣指示）


### 改名 `md-audio` → `audiobook`（2026-06-10）

EPUB 成為首選格式後，舊名失準。GitHub repo 改名後 git 操作自動轉址，但 **Pages 舊網址 404 不轉址**，已安裝的 PWA 要用新網址重新加到主畫面。書庫／續聽進度／語音快取／API key 都存在 `scandnavik.github.io` 網域下（以網域為單位、不分路徑），改名後全數保留。

### v0.6（2026-06-10）— 章節導覽＋進度百分比

- **章節哨兵**：md 的 `#`／`##` 與 EPUB 的 h1／h2 標記為章節（`\u0001` 哨兵字元），h3 以下只當正文停頓不成章
- **打包不跨章**：章節邊界是切段的硬邊界，「跳到第五章」保證從第五章第一個字開始播
- 章節下拉目錄（點選跳播）、播放列顯示「第 N／M 段 · 章節名」、手機鎖屏（mediaSession metadata）顯示書名＋當前章節
- 書庫進度加百分比；`nowText` 注入內容補 HTML escape
- ⚠️ 切段結果改變，此版會讓既有語音快取失效一次（最後一次動切段預設）

### v0.5（2026-06-10）— EPUB 內建解析，書籍首選格式

- 手寫 ZIP central directory 解析＋瀏覽器原生 `DecompressionStream("deflate-raw")` 解壓，**零外部依賴**
- 解析流程照 EPUB 規範：`container.xml` → OPF → 依 spine 順序逐章抽 XHTML 正文
- 正文抽取：只取葉節點區塊、標題補句號當停頓，`script`／`style`／`nav`／`figure`／`table`／`sup`（註腳）剝除
- 書名自動取 `dc:title`；EPUB 文字不再過 markdown 清理（`plain` 旗標進書庫）
- 動機：EPUB 是書籍原生格式，跳過「轉 md」損耗層；PDF 轉 md 的雜訊（硬斷行、頁碼）從源頭避開

### v0.4（2026-06-10）— 切段貪婪打包，修朗讀破碎

- 舊法「一空行一段」造成每段一次 TTS 請求＋一個音檔，書稿短段落多 → 一章幾十個接縫，聽感破碎
- 新法：句級拆分後**貪婪打包**成接近上限的連續大塊（實測 61 個零碎段 → 2500 字設定下 1 段）
- 預設每段上限 1500 → 2500，滑桿上限 3000 → 4000（OpenAI 單次約 4096 字元）
- 播放時預抓改為前方兩段，段落交界不停頓

### v0.3（2026-06-10）— 語系＋聲色

- 語系（自動／中文台灣／中文通用／英／日／韓）＋聲色（不指定／女聲／男聲）
- OpenAI：音色清單依聲色分組篩選；語系靠 `gpt-4o-mini-tts` 的 instructions 控口音（台灣腔），並納入快取 key
- 瀏覽器引擎：系統語音依語系篩選＋名稱啟發式判斷性別（猜不出時不硬篩，不會空清單）

### v0.2（2026-06-10）— 部署上線＋書庫＋續聽

- 部署 GitHub Pages（repo 公開無妨：BYOK 設計，key 只存使用者瀏覽器 localStorage，App 本體零機密）
- 書庫：載入過的文件自動登錄 IndexedDB，依最近播放排序，可刪除
- 續聽進度：記住每篇聽到第幾段，重開自動跳回；從書庫開啟沿用當時切段長度，保證段號對得上、快取不失效
- 實體 `manifest.webmanifest`＋`sw.js`（network-first 快取 App 殼），可正式安裝成 PWA

### v0.1（2026-06-08）— 初版單檔 prototype

- 單檔 `index.html`（無後端、無框架、無建置）：選檔／拖曳／貼上 → markdown 清理 → 切段 → 連續朗讀
- OpenAI TTS 三模型八音色＋瀏覽器 Web Speech API 雙引擎
- IndexedDB 語音快取（重播不重複收費）、mediaSession 鎖屏控制、設定持久化、深色 UI
