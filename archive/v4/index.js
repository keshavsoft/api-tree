import guards from "./internal-working/guards/index.js";
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

    guards({
        inSource: localSource,
        inApiPaths: localApiPaths,
        inExecutor: localExecutor
    });

    return buildTree({
        inSource: localSource,
        inApiPaths: localApiPaths,
        inExecutor: localExecutor
    });
};

export default apiTree;
export { apiTree, apiTree as start };
