import guards from "./engine/guards/index.js";
import run from "./engine/run.js";

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

    return run({
        inSource: localSource,
        inApiPaths: localApiPaths,
        inExecutor: localExecutor
    });
};

export default apiTree;
export { apiTree, apiTree as start };
