import { StepType } from "../core/Step.js";

export class Animator {
  constructor(renderer) {
    this.renderer = renderer;
    this.delay = 600; // ms between steps
  }

  async play(steps) {
    this.renderer.reset();

    for (const step of steps) {
      this.applyStep(step);
      await this.sleep(this.delay);
    }
  }

  applyStep(step) {
    switch (step.type) {
      case StepType.VISIT:
        this.renderer.highlightNode(step.node.id);
        break;

      case StepType.RELAX:
        this.renderer.highlightEdge(step.from.id, step.to.id);
        break;

      case StepType.UPDATE:
        break;

      case StepType.FINALIZE:
        this.renderer.markVisited(step.node.id);
        break;
    }
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
