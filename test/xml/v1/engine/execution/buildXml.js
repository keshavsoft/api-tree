import { collectionTemplate, dataTemplate } from "./templates.js";

const startFunc = ({ inEndpoint, inParam, inArgs }) => {
    const localEndpoint = inEndpoint;
    const localParam = inParam;
    const localArgs = inArgs || [];

    if (localEndpoint?.reportId) {
        let staticVars = "";

        if (typeof localParam === "string" && localParam.length > 0) {
            staticVars += `<SVCURRENTCOMPANY>${localParam}</SVCURRENTCOMPANY>`;
        } else if (typeof localParam === "object" && localParam?.company) {
            staticVars += `<SVCURRENTCOMPANY>${localParam.company}</SVCURRENTCOMPANY>`;
        }

        if (localEndpoint.staticVariables) {
            staticVars += localEndpoint.staticVariables;
        }

        if (localArgs[0] && typeof localArgs[0] === "string") {
            staticVars += localArgs[0];
        }

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
    }

    if (localArgs.length >= 2 && localArgs[0] && localArgs[1]) {
        staticVars += `<SVFROMDATE TYPE="Date">${localArgs[0]}</SVFROMDATE><SVTODATE TYPE="Date">${localArgs[1]}</SVTODATE>`;
    }

    const tdlMessage = localEndpoint?.tdl || "";

    return collectionTemplate
        .replace("{{STATICVARIABLES}}", staticVars)
        .replace("{{TDLMESSAGE}}", tdlMessage);
};

export default startFunc;
