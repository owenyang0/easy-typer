import { Coding, Phrase } from '../types'

const compareFn = (a: Coding, b: Coding) => a.weight - b.weight

export class TrieNode {
  /**
   * 子节点
   */
  public children?: Map<string, TrieNode>
  /**
   * 节点值
   */
  public value?: Phrase

  static convert (from: { children?: Map<string, object>; value?: Phrase }): TrieNode {
    const node = new TrieNode()
    node.value = from.value

    if (from.children) {
      node.children = new Map<string, TrieNode>()
      for (const entry of from.children.entries()) {
        node.children.set(entry[0], this.convert(entry[1]))
      }
    }

    return node
  }

  get (key: string): TrieNode | null {
    if (!this.children) {
      return null
    }

    const value = this.children.get(key)
    return value || null
  }

  set (key: string) {
    if (!this.children) {
      this.children = new Map<string, TrieNode>()
    }
    const node = new TrieNode()
    this.children.set(key, node)

    return node
  }
}

export class TrieTree {
  public root: TrieNode = new TrieNode()

  /**
   * 加词
   * @param text 短语
   * @param code 编码
   * @param index 选重位置, `-1`表示无须选重，何如标点
   */
  put (text: string, code: string, index = -1): void {
    let node = this.root
    for (const word of text) {
      let sub = node.get(word)
      if (!sub) {
        sub = node.set(word)
      }
      node = sub
    }

    const length = code.length
    const weight = (index === -1 || (index === 0 && length === 4) ? length + 0.05 : length + 1) * 10 + Math.max(index, 0)
    if (node.value) {
      const { codings } = node.value
      if (codings.findIndex(v => v.code === code) < 0) {
        codings.push(new Coding(weight, code, index))
      }
    } else {
      node.value = new Phrase(weight, text, code, index)
    }
  }

  /**
   * 查询短语
   * @param text 短语
   */
  get (text: string): Phrase | undefined {
    let node = this.root
    for (const word of text) {
      const sub = node.get(word)
      if (!sub) {
        return undefined
      }
      node = sub
    }

    return node.value
  }

  sort (node?: TrieNode): void {
    if (!node) {
      node = this.root
    }

    if (node.value && node.value.codings.length > 1) {
      node.value.codings.sort(compareFn)
    }

    if (node.children) {
      for (const val of node.children.values()) {
        this.sort(val)
      }
    }
  }
}
