import { Graph } from "./Graph.js";
import { StepType } from "./Step.js";
import { MinHeap } from "./helper/MinHeap.js";

export class Dijkstra {
  constructor(graph) {
    if (!(graph instanceof Graph)) {
      throw new Error("graph phải là một Graph object");
    }

    this.graph = graph;
  }

  run(startId, endId) {
    if (
      typeof startId !== "string" ||
      typeof endId !== "string" ||
      startId.length === 0 ||
      endId.length === 0
    ) {
      throw new Error("startId và endId phải là chuỗi không rỗng");
    }
    const start = this.graph.getNode(startId);
    const end = this.graph.getNode(endId);
    if (!start || !end) {
      throw new Error("start hoặc end node không tồn tại trong graph");
    }

    const distances = new Map();
    const visited = new Set();
    const previous = new Map();
    const steps = [];

    this.graph.getAllNodes().forEach((node) => {
      distances.set(node, Infinity);
    });

    distances.set(start, 0);

    const queue = new MinHeap((a, b) => distances.get(a) - distances.get(b));
    queue.push(start);

    while (queue.size() > 0) {
      const current = queue.pop();

      if (visited.has(current)) continue;

      steps.push({
        type: StepType.FINALIZE,
        node: current,
        dist: distances.get(current),
        from: previous.get(current) || null,
      });

      visited.add(current);

      if (current === end) {
        steps.push({
          type: StepType.PATH,
          path: this.reconstructPath(start, end, previous),
        });
        return {
          distance: distances.get(end),
          steps,
          previous,
          start,
          end,
        };
      }

      for (const edge of current.edges) {
        if (visited.has(edge.target)) continue;

        steps.push({
          type: StepType.RELAX,
          from: current,
          to: edge.target,
          weight: edge.weight,
          fromDist: distances.get(current),
          toDist: distances.get(edge.target),
        });

        const newDist = distances.get(current) + edge.weight;

        if (newDist < distances.get(edge.target)) {
          steps.push({
            type: StepType.UPDATE,
            node: edge.target,
            from: current,
            oldDist: distances.get(edge.target),
            newDist: newDist,
          });

          distances.set(edge.target, newDist);
          previous.set(edge.target, current);
          queue.push(edge.target);
        }
      }
    }

    steps.push({
      type: StepType.PATH,
      path: this.reconstructPath(start, end, previous),
    });
    return {
      distance: distances.get(end),
      steps,
      previous,
      start,
      end,
    };
  }

  reconstructPath(start, end, previous) {
    const path = [];
    let current = end;

    while (current) {
      path.unshift(current);
      current = previous.get(current);
    }

    if (path.length > 0 && path[0] === start) {
      return path;
    } else {
      return [];
    }
  }
}
