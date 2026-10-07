import guards from "./engine/guards/index.js";
import run from "./engine/run.js";

const apiTree = (source, recipeOrExecutor, executor) => {
    let localSource = source;
    let localRecipe = undefined;
    let localExecutor = undefined;

    if (source && typeof source === "object" && "inSource" in source) {
        localSource = source.inSource;
        localRecipe = source.inRecipe ?? source.inInstruction ?? source.inApiPaths;
        localExecutor = source.inExecutor;
    } else if (executor === undefined && typeof recipeOrExecutor === "function") {
        localRecipe = undefined;
        localExecutor = recipeOrExecutor;
    } else {
        localRecipe = recipeOrExecutor;
        localExecutor = executor;
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

export default apiTree;
export { apiTree, apiTree as start };
