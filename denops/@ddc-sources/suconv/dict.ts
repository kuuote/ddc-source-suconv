import { Trie } from "./trie.ts";
import { romToHira } from "./rom_hira.ts";
import { kanaConvert } from "./convert.ts";
import { getOkuriStr } from "./okuri.ts";
import { hiraToKata } from "./hira_kata.ts";

const okuriAriMarker = ";; okuri-ari entries.";
const okuriNasiMarker = ";; okuri-nasi entries.";

const trie = new Trie<[string, string]>();
for (const e of romToHira) {
  trie.set(e[0], e[1]);
}

type Candidate = [word: string, abbr?: string];

export class Dictionary {
  #okuriAri: Map<string, Candidate[]> = new Map();
  #okuriNasi: Map<string, Candidate[]> = new Map();

  async load(path: string) {
    let mode = -1;
    this.#okuriAri = new Map();
    this.#okuriNasi = new Map();
    const a: Map<string, Candidate[]>[] = [this.#okuriAri, this.#okuriNasi];
    const binary = await Deno.readFile(path);
    let data = "";
    // euc-jpとutf-8以外知らん
    try {
      const decoder = new TextDecoder("euc-jp", {
        fatal: true,
      });
      data = decoder.decode(binary);
    } catch {
      const decoder = new TextDecoder("utf-8", {
        fatal: true,
      });
      data = decoder.decode(binary);
    }
    const lines = data.split("\n");
    for (const line of lines) {
      if (line === okuriAriMarker) {
        mode = 0;
        continue;
      }
      if (line === okuriNasiMarker) {
        mode = 1;
        continue;
      }
      if (mode == -1) continue;
      const pos = line.indexOf(" ");
      if (pos !== -1) {
        a[mode].set(
          line.substring(0, pos),
          line.slice(pos + 2, -1)
            .split("/")
            .map((c) => c.split(";") as Candidate),
        );
      }
    }
  }

  getCandidates(inputRaw: string): Candidate[] {
    const input = kanaConvert(trie, inputRaw);

    // abbrev
    if (input[0] !== ";") {
      const candidates = [...this.#okuriNasi]
        .filter((e) => e[0].startsWith(inputRaw));
      candidates.sort((a, b) => a[0].localeCompare(b[0]));
      return [[input], [hiraToKata(input)], ...candidates.flatMap((e) => e[1])];
    }

    const [, kana, okuri] = input.split(/;/);
    if (okuri == null) {
      const candidates = [...this.#okuriNasi]
        .filter((e) => e[0].startsWith(kana.replace(/[a-z]*$/, "")));
      candidates.sort((a, b) => a[0].localeCompare(b[0]));
      return candidates.flatMap((e) => e[1]);
    } else {
      const okuriStr = getOkuriStr(kana, okuri);
      if (okuriStr == null) {
        return [];
      }
      return (this.#okuriAri.get(okuriStr) ?? [])
        .map((c) => [c[0] + okuri, c[1]]);
    }
  }
}