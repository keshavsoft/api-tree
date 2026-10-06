import validate from "./internal-working/validate/index.js";
import routeStart from "./internal-working/route/index.js";

const start = (inSource, inApiPaths, inExecutor, inOptions) => {
    let source = inSource;
    let paths = inApiPaths;
    let executor = inExecutor;
    let options = inOptions;

    if (inSource && typeof inSource === "object" && "inSource" in inSource) {
        source = inSource.inSource;
        paths = inSource.inApiPaths;
        executor = inSource.inExecutor;
        options = inSource.inOptions;
    }

    validate({
        inSource: source,
        inApiPaths: paths,
        inExecutor: executor,
        inOptions: options
    });

    return routeStart({
        inApiPaths: paths,
        inSource: source,
        inExecutor: executor,
        inOptions: options
    });
};

export default start;
export { start, start as apiTree };
