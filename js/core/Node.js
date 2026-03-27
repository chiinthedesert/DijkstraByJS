import { Edge } from "./Edge.js";

export class Node {
  constructor(id) {
    if (typeof id !== "string" || id.length === 0) {
      throw new Error("id phải là một chuỗi không rỗng");
    }

    this.id = id;
    this.edges = [];
  }

  addEdge(edge) {
    if (!(edge instanceof Edge)) {
      throw new Error("edge phải là một Edge object");
    }

    if (edge.source !== this) {
      throw new Error("edge source phải là node hiện tại");
    }

    this.edges.push(edge);
  }

  removeEdgeTo(target) {
    for (let i = this.edges.length - 1; i >= 0; i--) {
      if (this.edges[i].target === target) {
        this.edges.splice(i, 1);
      }
    }
  }

  toString() {
    return this.id;
  }
}
