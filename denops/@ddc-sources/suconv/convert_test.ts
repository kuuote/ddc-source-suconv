import { Trie } from "./trie.ts";
import { romToHira } from "./rom_hira.ts";
import * as t from "https://deno.land/std@0.162.0/testing/asserts.ts";
import { kanaConvert } from "./convert.ts";

const trie = new Trie<[string, string]>();
for (const e of romToHira) {
  trie.set(e[0], e[1]);
}

Deno.test({
  name: "kanaConvert",
  fn() {
    t.assertEquals(kanaConvert(trie, "nihongoyatteiki"), "にほんごやっていき");
  },
});
