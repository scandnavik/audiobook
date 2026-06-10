# Audiobook｜有聲書 — 版本紀錄

### 品牌配色（2026-06-10）

深色主題改為紙色淺色主題：底紙 `#FAFAF7`、文字 `#1A1A1A`、主色藍 `#004AAD`（60%）、副色青 `#0097B2`（30%）、琥珀 `#FFBD59` 僅點綴（App icon 圓點；進度條用唯一漸層 藍→青）。不放 logo。同時加**深色模式**：預設跟隨系統，設定可手動切（跟隨系統／淺色／深色），深色版用同色相提亮（藍 `#4D8DFF`、青 `#2FB6CC`）。

### 產品更名（2026-06-10）：說書機 → Audiobook｜有聲書

App 標題、manifest（安裝名「有聲書」）、鎖屏顯示、README 全面更名；內部儲存 key（`shuoshu.*`）不變，既有使用者的設定、書庫、快取不受影響。

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
