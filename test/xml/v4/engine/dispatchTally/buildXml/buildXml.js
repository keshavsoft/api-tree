import { collectionTemplate, dataTemplate } from "./templates.js";

const startFunc = ({ inEndpoint, inParam }) => {
    const localEndpoint = inEndpoint;
    const localParam = inParam;

    if (localEndpoint?.reportId) {
        let staticVars = "";

        if (typeof localParam === "string" && localParam.length > 0) {
            staticVars += `<SVCURRENTCOMPANY>${localParam}</SVCURRENTCOMPANY>`;
        } else if (typeof localParam === "object" && localParam?.company) {
            staticVars += `<SVCURRENTCOMPANY>${localParam.company}</SVCURRENTCOMPANY>`;
        }

        if (localEndpoint.staticVariables) {
            staticVars += localEndpoint.staticVariables;
        };

        return dataTemplate
            .replace("{{ID}}", localEndpoint.reportId)
            .replace("{{STATICVARIABLES}}", staticVars);
    }

    let staticVars = "";

    if (typeof localParam === "string" && localParam.length > 0) {
        staticVars += `<SVCURRENTCOMPANY>${localParam}</SVCURRENTCOMPANY>`;
    } else if (typeof localParam === "object" && localParam) {
        if (localParam.company) {
            staticVars += `<SVCURRENTCOMPANY>${localParam.company}</SVCURRENTCOMPANY>`;
        }
        if (localParam.fromDate && localParam.toDate) {
            staticVars += `<SVFROMDATE TYPE="Date">${localParam.fromDate}</SVFROMDATE><SVTODATE TYPE="Date">${localParam.toDate}</SVTODATE>`;
        }
    };

    const tdlMessage = localEndpoint?.tdl || "";

    return collectionTemplate
        .replace("{{STATICVARIABLES}}", staticVars)
        .replace("{{TDLMESSAGE}}", tdlMessage);
};

export default startFunc;
