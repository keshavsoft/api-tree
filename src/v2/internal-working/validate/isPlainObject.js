const startFunc = ({ inValue }) => {
    const localValue = inValue;

    if (localValue === null || typeof localValue !== "object") {
        return false;
    }

    const prototype = Object.getPrototypeOf(localValue);
    return prototype === Object.prototype || prototype === null;
};

export default startFunc;
