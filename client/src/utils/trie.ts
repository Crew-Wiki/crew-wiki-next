import {TitleAndUUID} from '@apis/client/document';

class Node {
  child: Map<string, Node> = new Map();
  uuid?: string;
  title?: string;
  documentType?: 'CREW' | 'ORGANIZATION';
  isEnd: boolean = false;
}

export class Trie {
  private root: Node;

  constructor(data: TitleAndUUID[] = []) {
    this.root = new Node();
    data.forEach(({title, uuid, documentType}) => this.add(title, uuid, documentType));
  }

  add(title: string, uuid: string, documentType: 'CREW' | 'ORGANIZATION' = 'CREW'): void {
    let currentNode = this.root;

    for (const char of title) {
      if (!currentNode.child.has(char)) {
        currentNode.child.set(char, new Node());
      }
      currentNode = currentNode.child.get(char)!;
    }
    currentNode.uuid = uuid;
    currentNode.title = title;
    currentNode.documentType = documentType;
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
    if (node.isEnd && node.uuid && node.title && node.documentType) {
      results.push({title: node.title, uuid: node.uuid, documentType: node.documentType});
    }
    for (const [char, child] of node.child) this.searchFunc(child, prefix + char, results);
  }

  delete(word: string, uuid: string): void {
    this.deleteFunc(this.root, word, uuid, 0);
  }

  private deleteFunc(node: Node, word: string, uuid: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEnd || node.uuid !== uuid) return false;
      node.isEnd = false;
      node.uuid = undefined;
      node.title = undefined;
      return node.child.size === 0;
    }

    const char = word[depth];
    const nextNode = node.child.get(char);
    if (!nextNode) return false;

    const shouldDeleteChild = this.deleteFunc(nextNode, word, uuid, depth + 1);
    if (shouldDeleteChild) node.child.delete(char);
    return node.child.size === 0 && !node.isEnd;
  }

  update(oldTitle: string, newTitle: string, uuid: string, documentType: 'CREW' | 'ORGANIZATION' = 'CREW'): void {
    this.delete(oldTitle, uuid);
    this.add(newTitle, uuid, documentType);
  }
}
