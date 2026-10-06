const startFunc = ({ inPath, inSource, inExecutor }) => {
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;

    return async (inParam, ...inArgs) => {
        const localParam = inParam;
        const localArgs = inArgs;

        return await localExecutor({
            inRoutePath: localPath,
            inParam: localParam,
            inArgs: localArgs,
            inSource: localSource
        });
    };
};

export default startFunc;
