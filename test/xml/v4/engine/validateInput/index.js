const startFunc = ({ inParam }) => {
    const localParam = inParam;

    if (localParam === undefined || localParam === null) {
        return "";
    }

    if (typeof localParam === "string") {
        return localParam.trim();
    }

    if (typeof localParam === "object") {
        return localParam;
    }

    return String(localParam);
};

export default startFunc;
