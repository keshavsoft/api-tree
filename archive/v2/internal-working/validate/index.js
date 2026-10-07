import isPlainObject from "./isPlainObject.js";

const startFunc = ({ inSource, inApiPaths, inExecutor, inOptions }) => {
    const localSource = inSource;
    const localApiPaths = inApiPaths;
    const localExecutor = inExecutor;
    const localOptions = inOptions;

    if (!isPlainObject({ inValue: localSource })) {
        throw new TypeError("source must be a JSON object.");
    }

    if (!Array.isArray(localApiPaths)) {
        throw new TypeError("apiPaths must be an array of strings.");
    }

    localApiPaths.forEach((path, index) => {
        if (typeof path !== "string") {
            throw new TypeError(`apiPaths must be an array of strings. apiPaths[${index}] must be a string.`);
        }

        const trimmed = path.trim();
        if (trimmed.length === 0) {
            throw new TypeError(`apiPaths[${index}] must not be an empty string.`);
        }

        const segments = trimmed.split(".");
        if (segments.some((segment) => segment.length === 0)) {
            throw new TypeError(`apiPaths[${index}] '${path}' contains an invalid empty path segment.`);
        }
    });

    if (typeof localExecutor !== "function") {
        throw new TypeError("executor must be a function.");
    }

    if (localOptions !== undefined && !isPlainObject({ inValue: localOptions })) {
        throw new TypeError("options must be an object if provided.");
    }
};

export default startFunc;
