import traverseObject from "./traverseObject/index.js";

const startFunc = ({ inSource, inRecipe, inExecutor, inPath, inRootSource }) => {
    const localSource = inSource;
    const localRecipe = inRecipe;
    const localExecutor = inExecutor;
    const localPath = inPath ?? [];
    const localRootSource = inRootSource ?? inSource;

    if (typeof localSource === "object" && localSource !== null) {
        return traverseObject({
            inSource: localSource,
            inRecipe: localRecipe,
            inExecutor: localExecutor,
            inPath: localPath,
            inRootSource: localRootSource
        });
    }

    return localSource;
};

export default startFunc;
