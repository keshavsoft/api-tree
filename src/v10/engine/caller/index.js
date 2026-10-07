const createCallable = ({ inRoutePath, inLeafSpec, inExecutor, inSource }) => {
    const localRoutePath = inRoutePath;
    const localLeafSpec = inLeafSpec;
    const localExecutor = inExecutor;
    const localSource = inSource;

    return async (param, ...args) => {
        const localParam = param;
        const localArgs = args;

        return await localExecutor({
            inRoutePath: localRoutePath,
            inLeafSpec: localLeafSpec,
            inParam: localParam,
            inArgs: localArgs,
            inSource: localSource
        });
    };
};

const createCaller = (source, executor) => {
    const localSource = source?.inSource ?? source;
    const localExecutor = source?.inExecutor ?? executor;

    return async (inRoutePath, inParam, ...inArgs) => {
        const localRoutePath = inRoutePath;
        const localParam = inParam;
        const localArgs = inArgs;

        const localLeafSpec = localRoutePath
            ?.split(".")
            .reduce((curr, key) => curr?.[key], localSource);

        return await localExecutor({
            inRoutePath: localRoutePath,
            inLeafSpec: localLeafSpec,
            inParam: localParam,
            inArgs: localArgs,
            inSource: localSource
        });
    };
};

const callRoute = async ({ inSource, inRoutePath, inExecutor, inParam, inArgs, inLeafSpec }) => {
    const localSource = inSource;
    const localRoutePath = inRoutePath;
    const localExecutor = inExecutor;
    const localParam = inParam;
    const localArgs = inArgs ?? [];

    const localLeafSpec = inLeafSpec ?? localRoutePath
        ?.split(".")
        .reduce((curr, key) => curr?.[key], localSource);

    return await localExecutor({
        inRoutePath: localRoutePath,
        inLeafSpec: localLeafSpec,
        inParam: localParam,
        inArgs: localArgs,
        inSource: localSource
    });
};

export default createCallable;
export { createCallable, createCaller, callRoute };
