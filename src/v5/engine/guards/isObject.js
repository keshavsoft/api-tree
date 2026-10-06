const startFunc = ({ inSource }) => {
    const localSource = inSource;

    if (!localSource || typeof localSource !== "object" || Array.isArray(localSource)) {
        throw new TypeError("source must be a JSON object.");
    }
};

export default startFunc;
