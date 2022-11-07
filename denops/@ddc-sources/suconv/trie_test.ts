import * as t from "https://deno.land/std@0.162.0/testing/asserts.ts";
import { Trie } from "./trie.ts";

Deno.test({
  name: "Trie",
  fn() {
    const trie = new Trie<string>();

    trie.set("", "empty");
    const result1 = trie.get("");
    t.assert(result1.found);
    t.assertEquals(result1.value, "empty");
    t.assertFalse(result1.remain);

    const result2 = trie.get("not found");
    t.assertFalse(result2.found);

    trie.set("long long", "");
    const result3 = trie.get("long");
    t.assertFalse(result3.found);
    t.assert(result3.remain);
  },
});
