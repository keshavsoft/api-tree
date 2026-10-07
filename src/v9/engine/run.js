import traverse from "./traversal/index.js";
import toTransformRecipe from "./toTransformRecipe.js";

const startFunc = ({ inSource, inRecipe, inExecutor }) => {
    const localSource = inSource;
    const localRecipe = toTransformRecipe({ inRecipe: inRecipe || inSource });
    const localExecutor = inExecutor;

    const fullTree = traverse({
        inSource: localSource,
        inRecipe: localRecipe,
        inExecutor: localExecutor
    });

    const rootKeys = Object.keys(fullTree);
    if (rootKeys.length === 1 && typeof fullTree[rootKeys[0]] === "object") {
        return fullTree[rootKeys[0]];
    }

    return fullTree;
};

export default startFunc;
