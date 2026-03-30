export class GraphRenderer {
  constructor(containerId) {
    this.cy = cytoscape({
      container: document.getElementById(containerId),

      elements: [],

      layout: {
        name: "cose",
      },

      style: [
        // ===== Nodes =====
        {
          selector: "node",
          style: {
            label: "data(id)",
            "text-valign": "center",
            "text-halign": "center",
            "background-color": "#666",
            color: "#fff",
          },
        },

        // ===== Edges =====
        {
          selector: "edge",
          style: {
            label: "data(weight)",
            "curve-style": "bezier",
            width: 2,
            "line-color": "#999",
          },
        },
        {
          selector: 'edge[directed = "true"]',
          style: {
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#999",
          },
        },
        // ===== Active node (VISIT) =====
        {
          selector: ".active-node",
          style: {
            "background-color": "red",
          },
        },

        // ===== Active edge (RELAX) =====
        {
          selector: ".active-edge",
          style: {
            "line-color": "orange",
            "target-arrow-color": "orange",
            "target-arrow-shape": "triangle",
            width: 4,
          },
        },
        // ===== Finalized node =====
        {
          selector: ".visited-node",
          style: {
            "background-color": "green",
          },
        },
        // ===== Finalized edge =====
        {
          selector: ".visited-edge",
          style: {
            "line-color": "green",
            "target-arrow-color": "green",
            width: 4,
          },
        },
      ],
    });
  }

  // ===== Load graph =====
  load(graph, parsedEdges) {
    const elements = [];

    for (const node of graph.getAllNodes()) {
      elements.push({
        data: { id: node.id },
      });
    }

    for (const edge of parsedEdges) {
      elements.push({
        data: {
          id: `${edge.from}-${edge.to}`,
          source: edge.from,
          target: edge.to,
          weight: edge.weight,
          directed: edge.directed ? "true" : "false",
        },
      });
    }

    this.cy.elements().remove();
    this.cy.add(elements);

    this.cy.layout({ name: "cose" }).run();
  }

  // ===== Clear temporary highlights =====
  clearActive() {
    this.cy.nodes().removeClass("active-node");
    this.cy.edges().removeClass("active-edge");
  }

  // ===== Highlight current node =====
  highlightNode(nodeId) {
    this.clearActive();
    this.cy.getElementById(nodeId).addClass("active-node");
  }

  // ===== Highlight edge =====
  highlightEdge(fromId, toId) {
    this.clearActive();

    const edgeId = `${fromId}-${toId}`;
    this.cy.getElementById(edgeId).addClass("active-edge");
  }

  // ===== Mark node as finalized =====
  markVisited(nodeId) {
    this.cy.getElementById(nodeId).addClass("visited-node");
  }
  // ===== Mark edge as finalized =====
  markEdgeVisited(fromId, toId) {
    const edgeId = `${fromId}-${toId}`;
    this.cy.getElementById(edgeId).addClass("visited-edge");
  }

  // ===== Reset everything =====
  reset() {
    this.cy.nodes().removeClass("active-node visited-node");
    this.cy.edges().removeClass("active-edge");
  }
}
