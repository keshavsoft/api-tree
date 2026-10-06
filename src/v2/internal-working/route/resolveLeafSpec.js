const startFunc = ({ inSource, inPath }) => {
    const localSource = inSource;
    const localPath = inPath;

    if (!localSource || typeof localSource !== "object" || !localPath) {
        return undefined;
    }

    const segments = localPath.split(".");
    let current = localSource;

    for (const segment of segments) {
        if (current === null || typeof current !== "object" || !(segment in current)) {
            return undefined;
        }
        current = current[segment];
    }

    return current;
};

export default startFunc;
