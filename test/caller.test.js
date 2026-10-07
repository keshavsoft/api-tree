import test from "node:test";
import assert from "node:assert/strict";
import apiTree, { createCaller, callRoute } from "../src/index.js";

const sampleSource = {
    app: {
        users: {
            profile: {
                fetch: { action: "fetch", resource: "UserProfile" }
            }
        }
    }
};

test("caller: createCaller binds source and executor for parameterized execution", async () => {
    let captured = null;

    const mockExecutor = async (context) => {
        captured = context;
        return { ok: true, data: "user-42" };
    };

    const call = createCaller({
        inSource: sampleSource,
        inExecutor: mockExecutor
    });

    const result = await call("app.users.profile.fetch", "42", "extra1");

    assert.deepEqual(result, { ok: true, data: "user-42" });
    assert.equal(captured.inRoutePath, "app.users.profile.fetch");
    assert.equal(captured.inParam, "42");
    assert.deepEqual(captured.inArgs, ["extra1"]);
    assert.equal(captured.inLeafSpec.resource, "UserProfile");
});

test("caller: callRoute executes single-shot with 3 primary inputs", async () => {
    let captured = null;

    const mockExecutor = async (context) => {
        captured = context;
        return "single-shot-done";
    };

    const result = await callRoute({
        inSource: sampleSource,
        inRoutePath: "app.users.profile.fetch",
        inExecutor: mockExecutor,
        inParam: "99"
    });

    assert.equal(result, "single-shot-done");
    assert.equal(captured.inRoutePath, "app.users.profile.fetch");
    assert.equal(captured.inParam, "99");
});

test("caller: apiTree exposes createCaller and callRoute as static properties", () => {
    assert.equal(typeof apiTree.createCaller, "function");
    assert.equal(typeof apiTree.callRoute, "function");
});
