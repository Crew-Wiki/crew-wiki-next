import {TitleAndUUID} from '@apis/client/document';

class Node {
  child: Map<string, Node> = new Map();
  uuid?: string;
  isEnd: boolean = false;
}

export class Trie {
  private root: Node;

  constructor(data: TitleAndUUID[] = []) {
    this.root = new Node();
    data.forEach(({title, uuid}) => this.insert(title, uuid));
  }

  insert(word: string, uuid: string): void {
    let currentNode = this.root;

    for (const char of word) {
      if (!currentNode.child.has(char)) {
        currentNode.child.set(char, new Node());
      }
      currentNode = currentNode.child.get(char)!;
    }
    currentNode.uuid = uuid;
    currentNode.isEnd = true;
  }

  search(prefix: string): TitleAndUUID[] {
    let currentNode = this.root;

    for (const char of prefix) {
      const nextNode = currentNode.child.get(char);
      if (!nextNode) return [];
      currentNode = nextNode;
    }

    const results: TitleAndUUID[] = [];
    this.searchFunc(currentNode, prefix, results);
    return results;
  }

  private searchFunc(node: Node, prefix: string, results: TitleAndUUID[]) {
    if (node.isEnd && node.uuid) results.push({title: prefix, uuid: node.uuid});
    for (const [char, child] of node.child) this.searchFunc(child, prefix + char, results);
  }

  delete(word: string): void {
    this.deleteFunc(this.root, word, 0);
  }

  private deleteFunc(node: Node, word: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEnd) return false;
      node.isEnd = false;
      return node.child.size === 0;
    }

    const char = word[depth];
    const nextNode = node.child.get(char);
    if (!nextNode) return false;

    const shouldDeleteChild = this.deleteFunc(nextNode, word, depth + 1);
    if (shouldDeleteChild) node.child.delete(char);
    return node.child.size === 0 && !node.isEnd;
  }

  update(oldTitle: string, newTitle: string, uuid: string): void {
    this.delete(oldTitle);
    this.insert(newTitle, uuid);
  }
}
