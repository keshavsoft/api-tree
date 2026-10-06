import routeStart from "./internal-working/route/index.js";

const isPlainObject = (value) => {
    if (value === null || typeof value !== "object") return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
};

const validate = (inSource, inApiPaths, inExecutor) => {
    if (!isPlainObject(inSource)) {
        throw new TypeError("source must be a JSON object.");
    }

    if (!Array.isArray(inApiPaths)) {
        throw new TypeError("apiPaths must be an array of strings.");
    }

    if (!inApiPaths.every((path) => typeof path === "string")) {
        throw new TypeError("apiPaths must be an array of strings.");
    }

    if (typeof inExecutor !== "function") {
        throw new TypeError("executor must be a function.");
    }
};

const start = (inSource, inApiPaths, inExecutor) => {
    validate(inSource, inApiPaths, inExecutor);

    return routeStart({
        inApiPaths,
        inSource,
        inExecutor
    });
};

export default start;
export { start };
