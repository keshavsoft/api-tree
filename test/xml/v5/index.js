import apiTree, { createCaller } from "../../../src/index.js";
import { source, apiPaths } from "tally-spec";
import execute from "./engine/index.js";

const tree = apiTree(source, apiPaths, execute);
console.log("tree: ", tree);

const dataFromTree = await tree.tally.company.fetch();
console.log("data from tree : ", dataFromTree);

const call = createCaller({ inSource: source, inExecutor: execute });
const dataFromCall = await call("tally.company.fetch");
console.log("data from call : ", dataFromCall);