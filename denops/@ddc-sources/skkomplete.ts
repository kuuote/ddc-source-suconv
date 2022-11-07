import {
  BaseSource,
  Context,
  Item,
} from "https://deno.land/x/ddc_vim@v3.0.0/types.ts";
import { Dictionary } from "./skkomplete/dict.ts";

type Params = {
  dictionary: string;
};

const re = /[a-zA-Z';,.-]+$/;

const dict = new Dictionary();

export class Source extends BaseSource<Params> {
  async onInit(args: { sourceParams: Params }) {
    await dict.load(args.sourceParams.dictionary);
  }

  getCompletePosition(args: { context: Context }): Promise<number> {
    const match = args.context.input.match(re);
    if (match == null) {
      return Promise.resolve(-1);
    }
    return Promise.resolve(args.context.input.length - match[0].length);
  }

  gather(args: { context: Context }): Promise<Item[]> {
    const match = args.context.input.match(re);
    if (match == null) {
      return Promise.resolve([]);
    }
    return Promise.resolve(
      dict.getCandidates(match[0]).map((c) => {
        return {
          word: c[0],
          abbr: " " + c[0] + (c[1] ? ";" + c[1] : ""),
        };
      }),
    );
  }

  params(): Params {
    return {
      dictionary: "/usr/share/skk/SKK-JISYO.L",
    };
  }
}
