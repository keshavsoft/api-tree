const startFunc = ({ inPath, inSource, inExecutor }) => {
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;

    return async (inParam) => {
        const localParam = inParam;

        return await localExecutor({
            inRoutePath: localPath,
            inParam: localParam,
            inSource: localSource
        });
    };
};

export default startFunc;
