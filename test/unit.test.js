import test from "node:test";
import assert from "node:assert/strict";
import apiTree from "../src/index.js";

const sampleSource = {
    app: {
        users: {
            profile: {
                fetch: { action: "fetch" }
            }
        }
    }
};

const samplePaths = ["app.users.profile.fetch"];

test("v3 unit: builds callable tree from positional arguments", async () => {
    const app = apiTree(sampleSource, samplePaths, async ({ inRoutePath, inParam }) => ({
        route: inRoutePath,
        param: inParam
    }));

    assert.equal(typeof app.users.profile.fetch, "function");
    const res = await app.users.profile.fetch("user-42");
    assert.deepEqual(res, { route: "app.users.profile.fetch", param: "user-42" });
});

test("v3 unit: supports named-object signature", async () => {
    const app = apiTree({
        inSource: sampleSource,
        inApiPaths: samplePaths,
        inExecutor: async ({ inRoutePath }) => inRoutePath
    });

    assert.equal(typeof app.users.profile.fetch, "function");
    const res = await app.users.profile.fetch();
    assert.equal(res, "app.users.profile.fetch");
});

test("v3 unit: passes multiple extra arguments in inArgs array", async () => {
    let capturedArgs = null;

    const app = apiTree(sampleSource, samplePaths, async ({ inParam, inArgs }) => {
        capturedArgs = { inParam, inArgs };
        return "done";
    });

    await app.users.profile.fetch("first", "second", 3, { four: true });

    assert.deepEqual(capturedArgs, {
        inParam: "first",
        inArgs: ["second", 3, { four: true }]
    });
});

test("v3 unit: rejects non-object or null source", () => {
    assert.throws(() => apiTree(null, samplePaths, () => {}), /source must be a JSON object/);
    assert.throws(() => apiTree("string", samplePaths, () => {}), /source must be a JSON object/);
    assert.throws(() => apiTree(123, samplePaths, () => {}), /source must be a JSON object/);
});

test("v3 unit: rejects non-array apiPaths", () => {
    assert.throws(() => apiTree(sampleSource, "app.users.fetch", () => {}), /apiPaths must be an array of strings/);
    assert.throws(() => apiTree(sampleSource, null, () => {}), /apiPaths must be an array of strings/);
});

test("v3 unit: rejects non-function executor", () => {
    assert.throws(() => apiTree(sampleSource, samplePaths, null), /executor must be a function/);
    assert.throws(() => apiTree(sampleSource, samplePaths, {}), /executor must be a function/);
});
