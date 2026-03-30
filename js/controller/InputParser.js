/**
 * Lớp InputParser chịu trách nhiệm phân tích cú pháp đầu vào từ người dùng,
 * bao gồm danh sách các node và cạnh.
 * */
export class InputParser {
  parse(nodesText, edgesText) {
    const nodes = this.parseNodes(nodesText);
    const edges = this.parseEdges(edgesText, nodes);
    return { nodes, edges };
  }

  /**
   * @param {string} text - Chuỗi đầu vào
   * @returns {string[]} Trả về một mảng các node, loại bỏ trùng lặp và khoảng trắng
   */
  parseNodes(text) {
    if (!text || text.trim() === "") {
      throw new Error("Nodes không được để trống");
    }

    const tokens = text.trim().split(/\s+/);

    return [...new Set(tokens)];
  }

  /**
   * @param {string} text - Chuỗi đầu vào
   * @param {string[]} nodes - Danh sách các node hợp lệ
   * @returns {{ from: string, to: string, weight: number, directed: boolean }[]} Trả về một mảng các cạnh với thông tin
   */
  parseEdges(text, nodes) {
    if (!text || text.trim() === "") {
      return [];
    }

    const nodeSet = new Set(nodes);
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const edges = [];
    for (const line of lines) {
      const edge = this.parseEdgeLine(line, nodeSet);
      edges.push(edge);
    }

    return edges;
  }

  /**
   * @param {string} line - Một dòng mô tả cạnh
   * @param {Set<string>} nodeSet - Tập node hợp lệ
   * @returns {{ from: string, to: string, weight: number, directed: boolean }} Trả về một đối tượng cạnh với thông tin từ, đến, trọng số và hướng
   */
  parseEdgeLine(line, nodeSet) {
    const parts = line.split(/\s+/);

    if (parts.length === 3) {
      const from = parts[0];
      const to = parts[1];
      const weight = Number(parts[2]);
      const directed = false;

      if (!nodeSet.has(from) || !nodeSet.has(to)) {
        throw new Error(`Node "${from}" hoặc "${to}" không tồn tại`);
      }
      if (isNaN(weight) || weight < 0) {
        throw new Error(`Trọng số cạnh không hợp lệ: "${parts[2]}"`);
      }

      return { from, to, weight, directed };
    }

    if (parts.length === 4 && parts[1] === "->") {
      const from = parts[0];
      const to = parts[2];
      const weight = Number(parts[3]);
      const directed = true;

      if (!nodeSet.has(from) || !nodeSet.has(to)) {
        throw new Error(`Node "${from}" hoặc "${to}" không tồn tại`);
      }
      if (isNaN(weight) || weight < 0) {
        throw new Error(`Trọng số cạnh không hợp lệ: "${parts[3]}"`);
      }
      return { from, to, weight, directed };
    }

    throw new Error(`Định dạng cạnh không hợp lệ: "${line}"`);
  }
}
