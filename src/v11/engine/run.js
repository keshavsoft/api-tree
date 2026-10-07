import traverse from "./traversal/index.js";
import toTransformRecipe from "./toTransformRecipe.js";

const startFunc = ({ inSource, inRecipe, inExecutor }) => {
    const localSource = inSource;
    const localRecipe = toTransformRecipe({ inRecipe: inRecipe || inSource });
    const localExecutor = inExecutor;

    return traverse({
        inSource: localSource,
        inRecipe: localRecipe,
        inExecutor: localExecutor
    });
};

export default startFunc;
