const startFunc = async ({ inXml }) => {
    const localXml = inXml;
    const localUrl = "http://localhost:9000";

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
