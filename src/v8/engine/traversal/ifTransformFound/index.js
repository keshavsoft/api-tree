import traverse from "../index.js";
import createCallable from "../../caller/index.js";

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
            newElement[newKey] = createCallable({
                inRoutePath: currentPath.join("."),
                inLeafSpec: value,
                inExecutor: localExecutor,
                inSource: localRootSource
            });
        }
    }

    return newElement;
};

export default startFunc;
