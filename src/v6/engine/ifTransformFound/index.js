import traverse from "../traverse.js";

const startFunc = ({ inSource, inTransform, inExecutor, inPath, inRootSource }) => {
    const localSource = inSource;
    const localTransform = inTransform;
    const localExecutor = inExecutor;
    const localPath = inPath;
    const localRootSource = inRootSource;

    const newElement = {};

    for (const [key, value] of Object.entries(localSource)) {
        if (!(key in localTransform)) {
            continue;
        }

        const directive = localTransform[key];
        const newKey = directive?.alterKey || key;
        const currentPath = [...localPath, key];

        if (directive && typeof directive === "object" && "transform" in directive) {
            newElement[newKey] = traverse({
                inSource: value,
                inRecipe: directive,
                inExecutor: localExecutor,
                inPath: currentPath,
                inRootSource: localRootSource
            });
        } else {
            newElement[newKey] = async (param, ...args) => {
                const localParam = param;
                const localArgs = args;

                return await localExecutor({
                    inRoutePath: currentPath.join("."),
                    inLeafSpec: value,
                    inParam: localParam,
                    inArgs: localArgs,
                    inSource: localRootSource
                });
            };
        }
    }

    return newElement;
};

export default startFunc;
