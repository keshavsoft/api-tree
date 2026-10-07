import buildTree from "./internal-working/buildTree.js";

const apiTree = (source, apiPaths, executor) => {
    let localSource = source;
    let localApiPaths = apiPaths;
    let localExecutor = executor;

    if (source && typeof source === "object" && "inSource" in source) {
        localSource = source.inSource;
        localApiPaths = source.inApiPaths;
        localExecutor = source.inExecutor;
    }

    if (!localSource || typeof localSource !== "object") {
        throw new TypeError("source must be a JSON object.");
    }

    if (!Array.isArray(localApiPaths)) {
        throw new TypeError("apiPaths must be an array of strings.");
    }

    if (typeof localExecutor !== "function") {
        throw new TypeError("executor must be a function.");
    }

    return buildTree({
        inSource: localSource,
        inApiPaths: localApiPaths,
        inExecutor: localExecutor
    });
};

export default apiTree;
export { apiTree, apiTree as start };
