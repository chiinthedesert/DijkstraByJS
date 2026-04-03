import { InputParser } from "./controller/InputParser.js";
import { AppController } from "./controller/AppController.js";
import { GraphRenderer } from "./ui/GraphRenderer.js";
import { Animator } from "./ui/Animator.js";

const inputParser = new InputParser();
const graphRenderer = new GraphRenderer("graph");
const animator = new Animator(graphRenderer);

const appController = new AppController(inputParser, animator, graphRenderer);

appController.init();
