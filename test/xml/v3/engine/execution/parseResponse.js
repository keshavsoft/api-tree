import { XMLParser } from "fast-xml-parser";

const startFunc = ({ inXml }) => {
    const localXml = inXml;

    const parser = new XMLParser({
        ignoreAttributes: false
    });

    return parser.parse(localXml);
};

export default startFunc;
