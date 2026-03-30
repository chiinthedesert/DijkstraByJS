import { GraphRenderer } from "./ui/GraphRenderer.js";
import { Animator } from "./ui/Animator.js";
import { AppController } from "./controller/AppController.js";

const renderer = new GraphRenderer("cy");
const animator = new Animator(renderer);

const app = new AppController(renderer, animator);

document.getElementById("runBtn").onclick = () => {
  app.handleRun();
};
