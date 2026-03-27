import { Node } from "./Node.js";

export class Edge {
  constructor(source, target, weight) {
    if (!(source instanceof Node)) {
      throw new Error("source phải là một Node object");
    }

    if (!(target instanceof Node)) {
      throw new Error("target phải là một Node object");
    }

    if (typeof weight !== "number" || weight < 0) {
      throw new Error("weight không được là số nguyên âm");
    }

    this.source = source;
    this.target = target;
    this.weight = weight;
  }

  toString() {
    return `${this.source.id} -> ${this.target.id} (${this.weight})`;
  }
}
