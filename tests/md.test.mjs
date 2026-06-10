import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./_extract.mjs";

const { marksToMarkdown } = load(["marksToMarkdown"]);

test("完整輸出:frontmatter＋章節分組＋引文＋筆記", () => {
  const marks = [
    { segIndex: 5, start: 0, end: 4, text: "後面的重點", note: "", chapterTitle: "第二章" },
    { segIndex: 1, start: 8, end: 12, text: "第一個重點", note: "我的心得", chapterTitle: "第一章" },
    { segIndex: 1, start: 0, end: 4, text: "更早的重點", note: "", chapterTitle: "第一章" },
  ];
  const md = marksToMarkdown("測試書", marks, "2026-06-10");
  assert.match(md, /^---\ntitle: 測試書\nexported: 2026-06-10\nmarks: 3\nsource: Audiobook｜有聲書\n---\n/);
  assert.match(md, /# 測試書 — 重點筆記/);
  // 章內依 segIndex+start 排序:更早的重點在第一個重點前
  const i1 = md.indexOf("更早的重點"), i2 = md.indexOf("第一個重點"), i3 = md.indexOf("後面的重點");
  assert.ok(i1 < i2 && i2 < i3);
  assert.match(md, /> 第一個重點\n\n我的心得/);     // 筆記緊跟引文
  assert.match(md, /## 第一章/);
  assert.match(md, /## 第二章/);
});

test("無章節掛在全文下、無筆記不留空行", () => {
  const md = marksToMarkdown("書", [{ segIndex: 0, start: 0, end: 2, text: "重點", note: "", chapterTitle: "" }], "2026-06-10");
  assert.match(md, /## 全文/);
  assert.match(md, /> 重點\n/);
  assert.doesNotMatch(md, /> 重點\n\n\S+\n\n##/); // 沒筆記就直接接下一塊
});

test("引文內換行壓成空格", () => {
  const md = marksToMarkdown("書", [{ segIndex: 0, start: 0, end: 5, text: "上行\n下行", note: "", chapterTitle: "" }], "2026-06-10");
  assert.match(md, /> 上行 下行/);
});
