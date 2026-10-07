const startFunc = async ({ inXml, inUrl }) => {
    const localXml = inXml;
    const localUrl = inUrl || "http://localhost:9000";

    const response = await fetch(localUrl, {
        method: "POST",
        headers: {
            "Content-Type": "text/xml"
        },
        body: localXml
    });

    return await response.text();
};

export default startFunc;
