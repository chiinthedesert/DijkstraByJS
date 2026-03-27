import { Node } from "./Node.js";
import { Edge } from "./Edge.js";

export class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(id) {
    if (typeof id !== "string" || id.length === 0) {
      throw new Error("node id phải là một chuỗi không rỗng");
    }
    if (!this.nodes.has(id)) {
      this.nodes.set(id, new Node(id));
    }
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  connectDirected(from, to, weight) {
    const source = this.nodes.get(from);
    const target = this.nodes.get(to);

    if (!source || !target) {
      throw new Error("nodes khong tồn tại trong graph");
    }
    if (source === target) {
      throw new Error("source và target không thể là cùng một node");
    }
    source.removeEdgeTo(target);
    source.addEdge(new Edge(source, target, weight));
  }

  connectUndirected(from, to, weight) {
    this.connectDirected(from, to, weight);
    this.connectDirected(to, from, weight);
  }
}
