const startFunc = ({ inApiPaths }) => {
    const localApiPaths = inApiPaths;

    if (!Array.isArray(localApiPaths)) {
        throw new TypeError("apiPaths must be an array of strings.");
    }

    for (let i = 0; i < localApiPaths.length; i++) {
        if (typeof localApiPaths[i] !== "string") {
            throw new TypeError(`apiPaths must be an array of strings. apiPaths[${i}] must be a string.`);
        }
    }
};

export default startFunc;
