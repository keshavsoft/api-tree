import buildXml from "./buildXml.js";
import transport from "./transport.js";
import parseResponse from "./parseResponse.js";

const startFunc = async ({ inEndpoint, inParam, inArgs, inUrl }) => {
    const localEndpoint = inEndpoint;
    const localParam = inParam;
    const localArgs = inArgs;
    const localUrl = inUrl;

    const xml = buildXml({
        inEndpoint: localEndpoint,
        inParam: localParam,
        inArgs: localArgs
    });

    const rawResponse = await transport({
        inXml: xml,
        inUrl: localUrl
    });

    const parsedJson = parseResponse({
        inXml: rawResponse
    });

    return parsedJson;
};

export default startFunc;
