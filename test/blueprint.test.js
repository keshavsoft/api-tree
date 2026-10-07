import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiTree from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blueprintSource = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../src/v5/blueprint/source.json"), "utf8")
);
const blueprintApi = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../src/v5/blueprint/api.json"), "utf8")
);

test("blueprint: builds the complete KeshavSoft ecosystem tree", () => {
    const app = apiTree(blueprintSource, blueprintApi, async ({ inRoutePath }) => {
        return { executedRoute: inRoutePath };
    });

    assert.equal(typeof app.app.ecosystem.architecture.philosophy.fetch, "function");
    assert.equal(typeof app.app.ecosystem.architecture.layers.fetch, "function");
    assert.equal(typeof app.app.ecosystem.tools.blueprint.fetch, "function");
    assert.equal(typeof app.app.ecosystem.tools.scaffolder.fetch, "function");
    assert.equal(typeof app.app.ecosystem.tools.intellisense.fetch, "function");
    assert.equal(typeof app.app.ecosystem.workflow.steps.fetch, "function");
    assert.equal(typeof app.app.ecosystem.workflow.principles.fetch, "function");
    assert.equal(typeof app.app.founder.profile.fetch, "function");
    assert.equal(typeof app.app.founder.links.fetch, "function");
    assert.equal(typeof app.app.company.info.fetch, "function");
    assert.equal(typeof app.app.company.packages.fetch, "function");
});

test("blueprint: executor returns data from source domain specification", async () => {
    const app = apiTree(blueprintSource, blueprintApi, async ({ inRoutePath, inSource }) => {
        const parts = inRoutePath.split(".");
        let node = inSource;
        for (const p of parts) {
            node = node?.[p];
        }
        return node?.data || null;
    });

    const philosophy = await app.app.ecosystem.architecture.philosophy.fetch();
    assert.equal(philosophy.concept, "Endpoints as Data");

    const founder = await app.app.founder.profile.fetch();
    assert.equal(founder.name, "Keshav Nalam");
});
