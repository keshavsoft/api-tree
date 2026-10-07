import validateInput from "./validateInput.js";
import getEndpointSpec from "./getEndpointSpec.js";
import dispatchTally from "./dispatchTally.js";

const startFunc = async ({ inRoutePath, inParam, inArgs, inSource }) => {
    const localRoutePath = inRoutePath;
    const localParam = inParam;
    const localArgs = inArgs;
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
        inParam: param,
        inArgs: localArgs
    });
};

export default startFunc;
