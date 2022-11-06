type TrieFound<T> = {
  found: true;
  remain: boolean;
  value: T;
};

type TrieNotFound = {
  found: false;
  remain: boolean;
};

export type TrieResult<T> = TrieFound<T> | TrieNotFound;

type TrieNode<T> = {
  value?: T;
  child: Map<string, TrieNode<T>>;
};

export class Trie<T> {
  root: TrieNode<T> = {
    child: new Map(),
  };

  get(key: string): TrieResult<T> {
    let node = this.root;
    for (const c of key) {
      const child = node.child.get(c);
      if (child == null) {
        return {
          found: false,
          remain: false,
        };
      }
      node = child;
    }
    const remain = node.child.size != 0;
    if (node.value == null) {
      return {
        found: false,
        remain,
      };
    }
    return {
      found: true,
      value: node.value,
      remain,
    };
  }

  set(key: string, value: T) {
    let node = this.root;
    for (const c of key) {
      if (!node.child.has(c)) {
        node.child.set(c, {
          child: new Map(),
        });
      }
      node = node.child.get(c)!;
    }
    node.value = value;
  }
}
