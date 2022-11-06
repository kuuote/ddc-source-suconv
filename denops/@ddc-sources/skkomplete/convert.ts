import { Trie } from "./trie.ts";

export function kanaConvert(
  trie: Trie<[string, string]>,
  input: string,
): string {
  // SKK用処理、大文字をsticky styleに分解しておく
  input = [...input].map((c) => {
    const l = c.toLowerCase();
    if (l !== c) {
      return ";" + l;
    }
    return c;
  }).join("");
  let feed = "";
  let output = "";
  for (const c of input + "*") {
    const next = feed + c;
    const result = trie.get(next);
    // 次の状態があるか確定できる文字からなるチャンクに分解することを考える
    // チャンクの要件を満たす場合はfeedに積んでいく
    if (result.remain || (!result.remain && result.found)) {
      feed = next;
      continue;
    } else {
      // 満たさなくなったらfeedを処理
      const prevResult = trie.get(feed);
      if (prevResult.found) {
        output += prevResult.value[0];
        feed = prevResult.value[1] + c;
      } else {
        output += feed;
        feed = c;
      }
    }
  }
  return output;
}
