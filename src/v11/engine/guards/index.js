import isObject from "./isObject.js";
import isStringArray from "./isStringArray.js";
import isFunction from "./isFunction.js";

const startFunc = ({ inSource, inRecipe, inExecutor }) => {
    const localSource = inSource;
    const localRecipe = inRecipe;
    const localExecutor = inExecutor;

    isObject({ inSource: localSource });

    if (localRecipe !== undefined) {
        if (Array.isArray(localRecipe)) {
            isStringArray({ inApiPaths: localRecipe });
        } else if (localRecipe === null || typeof localRecipe !== "object") {
            isStringArray({ inApiPaths: localRecipe });
        }
    }

    isFunction({ inExecutor: localExecutor });
};

export default startFunc;
