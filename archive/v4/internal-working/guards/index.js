import isObject from "./isObject.js";
import isStringArray from "./isStringArray.js";
import isFunction from "./isFunction.js";

const startFunc = ({ inSource, inApiPaths, inExecutor }) => {
    const localSource = inSource;
    const localApiPaths = inApiPaths;
    const localExecutor = inExecutor;

    isObject({ inSource: localSource });
    isStringArray({ inApiPaths: localApiPaths });
    isFunction({ inExecutor: localExecutor });
};

export default startFunc;
