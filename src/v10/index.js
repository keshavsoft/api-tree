import guards from "./engine/guards/index.js";
import run from "./engine/run.js";
import { createCaller, callRoute } from "./engine/caller/index.js";

const apiTree = (source, recipe, executor) => {
    let localSource = source?.inSource ?? source;
    let localRecipe = source?.inRecipe ?? source?.inInstruction ?? source?.inApiPaths ?? recipe;
    let localExecutor = source?.inExecutor ?? executor;

    if (executor === undefined && typeof recipe === "function") {
        localRecipe = undefined;
        localExecutor = recipe;
    }

    guards({
        inSource: localSource,
        inRecipe: localRecipe,
        inExecutor: localExecutor
    });

    return run({
        inSource: localSource,
        inRecipe: localRecipe,
        inExecutor: localExecutor
    });
};

apiTree.createCaller = createCaller;
apiTree.callRoute = callRoute;

export default apiTree;
export { apiTree, apiTree as start, createCaller, callRoute };
