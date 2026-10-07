import validateInput from "./validateInput/index.js";
import getEndpointSpec from "./getEndpointSpec/index.js";
import dispatchTally from "./dispatchTally/index.js";

const startFunc = async ({ inRoutePath, inParam, inSource }) => {
    const localRoutePath = inRoutePath;
    const localParam = inParam;
    const localSource = inSource;

    const param = validateInput({
        inParam: localParam
    });

    const endpoint = getEndpointSpec({
        inSource: localSource,
        inRoutePath: localRoutePath
    });

    return await dispatchTally({
        inEndpoint: endpoint,
        inParam: param
    });
};

export default startFunc;