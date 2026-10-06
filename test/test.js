import test from "node:test";
import assert from "node:assert/strict";
import apiTree from "../src/index.js";

const source = {
    app: {
        users: {
            profile: {
                fetch: { action: "fetch" }
            }
        }
    }
};

const paths = ["app.users.profile.fetch"];

test("builds a callable API tree", async () => {
    const api = apiTree(source, paths, async ({ inRoutePath, inParam, inSource }) => ({
        inRoutePath,
        inParam,
        spec: inSource.app.users.profile.fetch
    }));

    assert.equal(typeof api.users.profile.fetch, "function");

    const result = await api.users.profile.fetch("123");
    assert.deepEqual(result, {
        inRoutePath: "app.users.profile.fetch",
        inParam: "123",
        spec: { action: "fetch" }
    });
});

test("rejects a non-object source", () => {
    assert.throws(() => apiTree([], paths, () => {}), /source must be a JSON object/);
});

test("rejects non-array api paths", () => {
    assert.throws(() => apiTree(source, "app.users.profile.fetch", () => {}), /apiPaths must be an array of strings/);
});

test("rejects non-string api paths", () => {
    assert.throws(() => apiTree(source, ["app.users.profile.fetch", 10], () => {}), /apiPaths must be an array of strings/);
});

test("rejects a non-function executor", () => {
    assert.throws(() => apiTree(source, paths, {}), /executor must be a function/);
});
