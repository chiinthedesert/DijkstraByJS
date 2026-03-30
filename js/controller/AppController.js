import { Graph } from "../core/Graph.js";
import { Dijkstra } from "../core/Dijkstra.js";
import { InputParser } from "./InputParser.js";

export class AppController {
  constructor(renderer, animator) {
    this.renderer = renderer;
    this.animator = animator;
    this.parser = new InputParser();
  }

  handleRun() {
    try {
      // ===== 1. Get input =====
      const nodesText = document.getElementById("nodesInput").value;
      const edgesText = document.getElementById("edgesInput").value;
      const start = document.getElementById("startInput").value.trim();
      const end = document.getElementById("endInput").value.trim();

      // ===== 2. Parse =====
      const { nodes, edges } = this.parser.parse(nodesText, edgesText);

      // ===== 3. Build graph =====
      const graph = new Graph();

      for (const id of nodes) {
        graph.addNode(id);
      }

      for (const edge of edges) {
        if (edge.directed) {
          graph.connectDirected(edge.from, edge.to, edge.weight);
        } else {
          graph.connectUndirected(edge.from, edge.to, edge.weight);
        }
      }

      // ===== 4. Render =====
      this.renderer.load(graph, edges);

      // ===== 5. Run algorithm =====
      const dijkstra = new Dijkstra(graph);
      const result = dijkstra.run(start, end);

      // ===== 6. Animate =====
      this.animator.play(result.steps);
    } catch (err) {
      alert(err.message);
    }
  }
}
