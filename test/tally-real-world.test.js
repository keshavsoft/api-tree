import test from "node:test";
import assert from "node:assert/strict";
import apiTree from "../src/index.js";
import tallySource from "./fixtures/tally-source.json" with { type: "json" };
import tallyApiPaths from "./fixtures/tally-api.json" with { type: "json" };

test("real-world tally: builds the full 20-endpoint tree", () => {
    const executedCalls = [];

    const mockExecutor = async ({ inRoutePath, inParam, inArgs, inSource }) => {
        executedCalls.push({ inRoutePath, inParam, inArgs });
        return { ok: true, route: inRoutePath };
    };

    const app = apiTree(tallySource, tallyApiPaths, mockExecutor);

    // 1. Check top-level namespaces
    assert.equal(typeof app.tally.company.fetch, "function", "app.tally.company.fetch should be a function");
    assert.equal(typeof app.tally.vouchers.purchases.fetch, "function", "app.tally.vouchers.purchases.fetch should be a function");
    assert.equal(typeof app.tally.vouchers.sales.fetch, "function", "app.tally.vouchers.sales.fetch should be a function");
    assert.equal(typeof app.tally.masters.unit.all, "function", "app.tally.masters.unit.all should be a function");
    assert.equal(typeof app.tally.masters.stockItem.withBatches, "function", "app.tally.masters.stockItem.withBatches should be a function");
    assert.equal(typeof app.tally.masters.ledger.withGstDetails, "function", "app.tally.masters.ledger.withGstDetails should be a function");
    assert.equal(typeof app.tally.masters.stockGroup.withParent, "function", "app.tally.masters.stockGroup.withParent should be a function");
    assert.equal(typeof app.tally.reports.stockSummary.fetch, "function", "app.tally.reports.stockSummary.fetch should be a function");
});

test("real-world tally: executes company.fetch and passes correct route info", async () => {
    let capturedContext = null;

    const mockExecutor = async (context) => {
        capturedContext = context;
        return { companies: ["mani9", "demo"] };
    };

    const app = apiTree(tallySource, tallyApiPaths, mockExecutor);
    const result = await app.tally.company.fetch();

    assert.deepEqual(result, { companies: ["mani9", "demo"] });
    assert.equal(capturedContext.inRoutePath, "tally.company.fetch");
    assert.equal(capturedContext.inSource.tally.company.fetch.resource, "Company");
    assert.equal(capturedContext.inSource.tally.company.fetch.action, "fetch");
});

test("real-world tally: executes masters.stockItem.withBatches with single parameter", async () => {
    let capturedContext = null;

    const mockExecutor = async (context) => {
        capturedContext = context;
        return { items: [{ name: "Item A", batches: [1, 2] }] };
    };

    const app = apiTree(tallySource, tallyApiPaths, mockExecutor);
    const result = await app.tally.masters.stockItem.withBatches("Item A");

    assert.equal(capturedContext.inRoutePath, "tally.masters.stockItem.withBatches");
    assert.equal(capturedContext.inParam, "Item A");
    assert.deepEqual(capturedContext.inArgs, []);
});

test("real-world tally: executes reports.stockSummary.fetch with multiple parameters", async () => {
    let capturedContext = null;

    const mockExecutor = async (context) => {
        capturedContext = context;
        return { report: "Stock Summary Data" };
    };

    const app = apiTree(tallySource, tallyApiPaths, mockExecutor);
    const result = await app.tally.reports.stockSummary.fetch("2024-04-01", "2025-03-31", { explode: true });

    assert.equal(capturedContext.inRoutePath, "tally.reports.stockSummary.fetch");
    assert.equal(capturedContext.inParam, "2024-04-01");
    assert.deepEqual(capturedContext.inArgs, ["2025-03-31", { explode: true }]);
});

test("real-world tally: supports named object signature with full contract", async () => {
    let capturedPath = null;

    const app = apiTree({
        inSource: tallySource,
        inApiPaths: tallyApiPaths,
        inExecutor: async ({ inRoutePath }) => {
            capturedPath = inRoutePath;
            return "ok";
        }
    });

    const res = await app.tally.masters.godown.withParent("Main Location");
    assert.equal(res, "ok");
    assert.equal(capturedPath, "tally.masters.godown.withParent");
});
