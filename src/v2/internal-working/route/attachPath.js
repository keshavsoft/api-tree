import createLeafHandler from "./createLeafHandler.js";
import resolveLeafSpec from "./resolveLeafSpec.js";

const startFunc = ({ inTree, inPath, inSource, inExecutor }) => {
    const localTree = inTree;
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;

    const parts = localPath.split(".");
    const leafName = parts.pop();

    let branch = localTree;
    for (const segment of parts) {
        branch[segment] ??= {};
        branch = branch[segment];
    }

    const leafSpec = resolveLeafSpec({
        inSource: localSource,
        inPath: localPath
    });

    const handler = createLeafHandler({
        inPath: localPath,
        inSource: localSource,
        inExecutor: localExecutor,
        inLeafSpec: leafSpec
    });

    if (branch[leafName] && typeof branch[leafName] === "object") {
        Object.assign(handler, branch[leafName]);
    }

    branch[leafName] = handler;
};

export default startFunc;
