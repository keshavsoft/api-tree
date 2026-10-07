const startFunc = ({ inExecutor }) => {
    const localExecutor = inExecutor;

    if (typeof localExecutor !== "function") {
        throw new TypeError("executor must be a function.");
    }
};

export default startFunc;
