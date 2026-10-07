import buildXml from "./buildXml/buildXml.js";
import transport from "./transport.js";
import parseResponse from "./parseResponse.js";

const startFunc = async ({ inEndpoint, inParam }) => {
    const localEndpoint = inEndpoint;
    const localParam = inParam;

    const xml = buildXml({
        inEndpoint: localEndpoint,
        inParam: localParam
    });

    const rawResponse = await transport({
        inXml: xml
    });

    const parsedJson = parseResponse({
        inXml: rawResponse
    });

    return parsedJson;
};

export default startFunc;
