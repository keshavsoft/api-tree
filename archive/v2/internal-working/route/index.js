import attachPath from "./attachPath.js";

const startFunc = ({ inApiPaths, inSource, inExecutor, inOptions }) => {
    const localApiPaths = inApiPaths;
    const localSource = inSource;
    const localExecutor = inExecutor;
    const localOptions = inOptions ?? {};

    const tree = {};

    for (const path of localApiPaths) {
        attachPath({
            inTree: tree,
            inPath: path,
            inSource: localSource,
            inExecutor: localExecutor
        });
    }

    if (localApiPaths.length === 0) {
        return tree;
    }

    const rootSegments = new Set(localApiPaths.map((path) => path.split(".")[0]));

    if (rootSegments.size === 1) {
        const sharedRoot = rootSegments.values().next().value;
        const unwrap = localOptions.inUnwrapRoot !== false;
        return unwrap && tree[sharedRoot] ? tree[sharedRoot] : tree;
    }

    return tree;
};

export default startFunc;
