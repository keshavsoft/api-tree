const startFunc = ({ inPath, inSource, inExecutor, inLeafSpec }) => {
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;
    const localLeafSpec = inLeafSpec;
    const localPathSegments = localPath.split(".");

    const handler = async (inParam, ...inArgs) => {
        const localParam = inParam;
        const localArgs = inArgs;

        return await localExecutor({
            inRoutePath: localPath,
            inParam: localParam,
            inArgs: localArgs,
            inSource: localSource,
            inLeafSpec: localLeafSpec,
            inPathSegments: localPathSegments
        });
    };

    return handler;
};

export default startFunc;
