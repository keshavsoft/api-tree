const startFunc = ({ inSource, inApiPaths, inExecutor }) => {
    const localSource = inSource;
    const localApiPaths = inApiPaths;
    const localExecutor = inExecutor;

    const tree = {};

    for (const path of localApiPaths) {
        const parts = path.split(".");
        const leaf = parts.pop();

        let branch = tree;
        for (const segment of parts) {
            branch[segment] ??= {};
            branch = branch[segment];
        }

        branch[leaf] = async (param, ...args) => {
            const localParam = param;
            const localArgs = args;

            return await localExecutor({
                inRoutePath: path,
                inParam: localParam,
                inArgs: localArgs,
                inSource: localSource
            });
        };
    }

    const root = localApiPaths[0]?.split(".")[0];
    return root && tree[root] ? tree[root] : tree;
};

export default startFunc;
