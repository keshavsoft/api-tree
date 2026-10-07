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

const callRoute = async ({ inRoutePath, inLeafSpec, inParam, inArgs, inSource, inExecutor }) => {
    const localRoutePath = inRoutePath;
    const localLeafSpec = inLeafSpec;
    const localParam = inParam;
    const localArgs = inArgs ?? [];
    const localSource = inSource;
    const localExecutor = inExecutor;

    return await localExecutor({
        inRoutePath: localRoutePath,
        inLeafSpec: localLeafSpec,
        inParam: localParam,
        inArgs: localArgs,
        inSource: localSource
    });
};

export default createCallable;
export { createCallable, callRoute };
