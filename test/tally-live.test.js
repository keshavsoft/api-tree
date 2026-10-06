import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { XMLParser } from "fast-xml-parser";
import apiTree from "../src/index.js";

const tallySource = {
    tally: {
        company: {
            fetch: {
                action: "fetch",
                resource: "company",
                xmlPayload: "<ENVELOPE><HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER><BODY><EXPORTDATA><REQUESTDESC><REPORTNAME>List of Companies</REPORTNAME><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES></REQUESTDESC></EXPORTDATA></BODY></ENVELOPE>"
            }
        }
    }
};

const tallyApiPaths = ["tally.company.fetch"];

const queryTally = async (xmlPayload) => {
    return new Promise((resolve, reject) => {
        const req = http.request("http://localhost:9000", {
            method: "POST",
            headers: {
                "Content-Type": "text/xml;charset=utf-8",
                "Content-Length": Buffer.byteLength(xmlPayload)
            },
            timeout: 2000
        }, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => resolve(data));
        });

        req.on("error", reject);
        req.on("timeout", () => {
            req.destroy();
            reject(new Error("Tally connection timed out"));
        });

        req.write(xmlPayload);
        req.end();
    });
};

test("live tally: queries localhost:9000 and parses with fast-xml-parser", async (t) => {
    let tallyXml;
    try {
        tallyXml = await queryTally(tallySource.tally.company.fetch.xmlPayload);
    } catch {
        t.skip("TallyPrime is not running at http://localhost:9000; skipping live integration test.");
        return;
    }

    const parser = new XMLParser();
    const app = apiTree(tallySource, tallyApiPaths, async ({ inRoutePath, inSource }) => {
        const payload = inSource.tally.company.fetch.xmlPayload;
        const xml = await queryTally(payload);
        const parsed = parser.parse(xml);
        return {
            route: inRoutePath,
            parsed
        };
    });

    const res = await app.company.fetch();
    assert.equal(res.route, "tally.company.fetch");
    assert.ok(res.parsed, "Response was successfully parsed into JSON by fast-xml-parser");
});
