import ifTransformFound from "../ifTransformFound/index.js";

const startFunc = ({ inSource, inRecipe, inExecutor, inPath, inRootSource }) => {
    const localSource = inSource;
    const localRecipe = inRecipe;
    const localExecutor = inExecutor;
    const localPath = inPath;
    const localRootSource = inRootSource;

    let newElement = {};

    if (localRecipe && typeof localRecipe === "object" && "transform" in localRecipe) {
        newElement = ifTransformFound({
            inSource: localSource,
            inTransform: localRecipe.transform,
            inExecutor: localExecutor,
            inPath: localPath,
            inRootSource: localRootSource
        });
    }

    return newElement;
};

export default startFunc;
