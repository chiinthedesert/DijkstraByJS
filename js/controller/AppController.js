import { Graph } from "../core/Graph.js";
import { Dijkstra } from "../core/Dijkstra.js";

export class AppController {
  constructor(inputParser, animator, graphRenderer) {
    this.inputParser = inputParser;
    this.animator = animator;
    this.graphRenderer = graphRenderer;
  }

  init() {
    this.bindUI();
  }

  bindUI() {
    this.nodesInput = document.getElementById("nodesInput");
    this.edgesInput = document.getElementById("edgesInput");
    this.startInput = document.getElementById("startInput");
    this.endInput = document.getElementById("endInput");

    this.buildBtn = document.getElementById("buildBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.playBtn = document.getElementById("playBtn");

    this.buildBtn.onclick = () => this.handleBuild();
    this.nextBtn.onclick = () => this.animator.next();
    this.prevBtn.onclick = () => this.animator.previous();
    this.clearBtn.onclick = () => this.animator.resetView();
    this.playBtn.onclick = () => this.animator.play();
  }

  handleBuild() {
    try {
      const nodesText = this.nodesInput.value;
      const edgesText = this.edgesInput.value;
      const start = this.startInput.value.trim();
      const end = this.endInput.value.trim();

      const { nodes, edges } = this.inputParser.parse(nodesText, edgesText);

      const graph = new Graph();

      nodes.forEach((nodeId) => graph.addNode(nodeId));
      edges.forEach((edge) => {
        if (edge.directed) {
          graph.connectDirected(edge.from, edge.to, edge.weight);
        } else {
          graph.connectUndirected(edge.from, edge.to, edge.weight);
        }
      });

      const dijkstra = new Dijkstra(graph);
      const result = dijkstra.run(start, end);

      this.graphRenderer.load(graph, edges);

      this.animator.resetView();
      this.animator.build(result);
    } catch (err) {
      alert(err.message);
    }
  }
}
