import { StepType } from "../core/Step.js";
import { GraphRenderer } from "./GraphRenderer.js";

export class Animator {
  /**
   * @param {GraphRenderer} graphRenderer
   */
  constructor(graphRenderer) {
    this.graphRenderer = graphRenderer;
    this.steps = [];
    this.index = 0;
  }

  build(result) {
    this.steps = result.steps;
    this.index = 0;
    this.result = result;
    this.graphRenderer.reset();
  }

  play(time = 400) {
    var self = this;

    function run() {
      if (self.index >= self.steps.length) {
        return;
      }

      self.next();

      setTimeout(run, time);
    }

    run();
  }

  next() {
    if (this.index >= this.steps.length) return;

    this.index++;
    this.applyStep(this.steps[this.index - 1]);
  }

  previous() {
    if (this.index <= 0) return;
    this.index--;
    this.graphRenderer.reset();

    for (let i = 0; i < this.index; i++) {
      this.applyStep(this.steps[i]);
    }
  }

  resetView() {
    this.index = 0;
    this.graphRenderer.reset();
  }

  applyStep(step) {
    switch (step.type) {
      case StepType.FINALIZE:
        this.graphRenderer.setFinalizedNode(step.node.id);
        if (step.from) {
          this.graphRenderer.setFinalizedEdge(step.from.id, step.node.id);
        }
        break;

      case StepType.RELAX:
        this.graphRenderer.setRelaxEdge(step.from.id, step.to.id);
        break;

      case StepType.UPDATE:
        this.graphRenderer.setUpdatedNode(step.node.id);
        break;

      case StepType.PATH:
        this.graphRenderer.highlightPath(step.path);
        break;
    }
  }
}
