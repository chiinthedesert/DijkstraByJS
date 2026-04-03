export class GraphRenderer {
  constructor(containerId) {
    this.cy = cytoscape({
      container: document.getElementById(containerId),

      elements: [],

      layout: { name: "cose" },

      style: [
        // style cho nodes
        {
          selector: "node",
          style: {
            label: "data(id)",
            "background-color": "#666",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
          },
        },

        // style cho edges
        {
          selector: "edge",
          style: {
            label: "data(weight)",
            "text-rotation": "autorotate",

            "line-color": "#999",
            "curve-style": "bezier",
          },
        },
        {
          selector: 'edge[directed = "true"]',
          style: {
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#999",
          },
        },

        // style cho finalized nodes và edges
        {
          selector: ".finalized-node",
          style: {
            "background-color": "green",
          },
        },
        {
          selector: ".finalized-edge",
          style: {
            "line-color": "green",
            "target-arrow-color": "green",
          },
        },

        // style cho relax edges
        {
          selector: ".relax-edge",
          style: {
            "line-color": "orange",
            "target-arrow-color": "orange",
          },
        },

        // style cho updated nodes
        {
          selector: ".updated-node",
          style: {
            "background-color": "yellow",
          },
        },

        // style cho shortest path
        {
          selector: ".path-node",
          style: {
            "background-color": "blue",
          },
        },
        {
          selector: ".path-edge",
          style: {
            "line-color": "blue",
            "target-arrow-color": "blue",
          },
        },
      ],
    });
  }

  /**
   * @param {Graph} graph - Đối tượng Graph đã được xây dựng từ input
   * @param {Array<{ from: string, to: string, weight: number, directed: boolean }>} parsedEdges - Mảng cạnh đã được phân tích từ input
   */
  load(graph, parsedEdges) {
    const elements = [];

    for (const node of graph.getAllNodes()) {
      elements.push({ data: { id: node.id } });
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

  /**
   * Thêm class "finalized-node" vào node đã được finalize
   * @param {string} id - ID của node
   */
  setFinalizedNode(id) {
    this.cy.getElementById(id).removeClass("updated-node");
    this.cy.getElementById(id).addClass("finalized-node");
  }

  /**
   * Thêm class "updated-node" vào node đã được cập nhật khoảng cách
   * @param {string} id - ID của node
   */
  setUpdatedNode(id) {
    this.cy.getElementById(id).addClass("updated-node");
  }

  /**
   * Thêm class "relax-edge" vào cạnh đang được relax
   * @param {string} from - ID của node nguồn
   * @param {string} to - ID của node đích
   */
  setRelaxEdge(from, to) {
    this.getEdge(from, to).addClass("relax-edge");
  }

  /**
   * Thêm class "finalized-edge" vào cạnh đã được finalize
   * @param {string} from - ID của node nguồn
   * @param {string} to - ID của node đích
   */
  setFinalizedEdge(from, to) {
    this.getEdge(from, to).removeClass("relax-edge");
    this.getEdge(from, to).addClass("finalized-edge");
  }

  /**
   * Đánh dấu đường đi ngắn nhất bằng cách thêm class "path-node" và "path-edge"
   * @param {Array<{ id: string }>} path - Mảng các node trong đường đi ngắn nhất, mỗi node có thuộc tính id
   */
  highlightPath(path) {
    if (!path) return;

    for (const node of path) {
      this.cy.getElementById(node.id).addClass("path-node");
    }

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i].id;
      const to = path[i + 1].id;
      this.getEdge(from, to).addClass("path-edge");
    }
  }

  /**
   * Lấy cạnh giữa hai node, nếu cạnh không có hướng thì sẽ kiểm tra cả hai hướng
   * @param {string} from - ID của node nguồn
   * @param {string} to - ID của node đích
   * @returns {cytoscape.EdgeCollection} Trả về một EdgeCollection chứa cạnh giữa from và to, hoặc rỗng nếu không tồn tại
   */
  getEdge(from, to) {
    const direct = this.cy.getElementById(`${from}-${to}`);
    if (direct.length > 0) return direct;

    const reverse = this.cy.getElementById(`${to}-${from}`);
    if (reverse.length > 0 && reverse.data("directed") === "false")
      return reverse;

    return this.cy.collection();
  }

  /**
   * Loại bỏ tất cả các class trạng thái để reset lại đồ thị về trạng thái ban đầu
   */
  reset() {
    this.cy
      .elements()
      .removeClass(
        "finalized-node updated-node relax-edge finalized-edge path-node path-edge",
      );
  }
}
