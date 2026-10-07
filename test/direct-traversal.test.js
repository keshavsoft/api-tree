import test from "node:test";
import assert from "node:assert/strict";
import { source } from "tally-spec";
import apiTree from "../src/index.js";

test("direct traversal: builds callable tree with only (source, executor) without apiPaths", async () => {
    const app = apiTree(source, async ({ inRoutePath, inLeafSpec, inParam }) => {
        return {
            route: inRoutePath,
            spec: inLeafSpec,
            param: inParam
        };
    });

    assert.equal(typeof app.tally.company.fetch, "function");
    assert.equal(typeof app.tally.masters.unit.all, "function");
    assert.equal(typeof app.tally.masters.ledger.all, "function");
    assert.equal(typeof app.tally.vouchers.purchases.fetch, "function");

    const res = await app.tally.masters.unit.all("mani9");
    assert.equal(res.route, "tally.masters.unit.all");
    assert.equal(res.param, "mani9");
    assert.equal(res.spec.resource, "Unit");
    assert.equal(res.spec.action, "fetch");
});
