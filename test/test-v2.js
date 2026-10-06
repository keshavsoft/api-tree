import test from "node:test";
import assert from "node:assert/strict";
import apiTree from "../src/index.js";

const source = {
    app: {
        users: {
            profile: {
                fetch: {
                    action: "fetch",
                    resource: "User",
                    description: "Get user profile"
                }
            }
        },
        reports: {
            summary: {
                action: "report",
                resource: "Summary"
            }
        }
    },
    orders: {
        create: {
            action: "insert",
            resource: "Order"
        }
    }
};

test("v2: builds a callable API tree with single root unwrapped", async () => {
    const paths = ["app.users.profile.fetch"];
    const api = apiTree(source, paths, async ({ inRoutePath, inParam, inSource, inLeafSpec }) => ({
        inRoutePath,
        inParam,
        inLeafSpec
    }));

    assert.equal(typeof api.users.profile.fetch, "function");

    const result = await api.users.profile.fetch("user-1");
    assert.deepEqual(result, {
        inRoutePath: "app.users.profile.fetch",
        inParam: "user-1",
        inLeafSpec: {
            action: "fetch",
            resource: "User",
            description: "Get user profile"
        }
    });
});

test("v2: automatically preserves multiple root namespaces", async () => {
    const paths = ["app.users.profile.fetch", "orders.create"];
    const api = apiTree(source, paths, async ({ inRoutePath, inLeafSpec }) => ({
        inRoutePath,
        action: inLeafSpec?.action
    }));

    assert.equal(typeof api.app.users.profile.fetch, "function");
    assert.equal(typeof api.orders.create, "function");

    const userRes = await api.app.users.profile.fetch();
    assert.deepEqual(userRes, {
        inRoutePath: "app.users.profile.fetch",
        action: "fetch"
    });

    const orderRes = await api.orders.create();
    assert.deepEqual(orderRes, {
        inRoutePath: "orders.create",
        action: "insert"
    });
});

test("v2: supports explicit inUnwrapRoot: false option", async () => {
    const paths = ["app.users.profile.fetch"];
    const api = apiTree(
        source,
        paths,
        async ({ inRoutePath }) => inRoutePath,
        { inUnwrapRoot: false }
    );

    assert.equal(typeof api.app.users.profile.fetch, "function");
    const result = await api.app.users.profile.fetch();
    assert.equal(result, "app.users.profile.fetch");
});

test("v2: supports multi-argument leaves and inPathSegments", async () => {
    const paths = ["app.users.profile.fetch"];
    const api = apiTree(source, paths, async ({ inParam, inArgs, inPathSegments }) => ({
        inParam,
        inArgs,
        inPathSegments
    }));

    const result = await api.users.profile.fetch("p1", "arg1", "arg2");
    assert.deepEqual(result, {
        inParam: "p1",
        inArgs: ["arg1", "arg2"],
        inPathSegments: ["app", "users", "profile", "fetch"]
    });
});

test("v2: supports hybrid branches (callable node with children)", async () => {
    const customSource = {
        api: {
            users: {
                action: "listUsers",
                profile: {
                    action: "getProfile"
                }
            }
        }
    };
    const paths = ["api.users", "api.users.profile"];
    const tree = apiTree(customSource, paths, async ({ inRoutePath, inLeafSpec }) => ({
        path: inRoutePath,
        action: inLeafSpec?.action
    }));

    assert.equal(typeof tree.users, "function");
    assert.equal(typeof tree.users.profile, "function");

    const parentRes = await tree.users();
    assert.deepEqual(parentRes, { path: "api.users", action: "listUsers" });

    const childRes = await tree.users.profile();
    assert.deepEqual(childRes, { path: "api.users.profile", action: "getProfile" });
});

test("v2: rejects empty paths or empty segments", () => {
    assert.throws(() => apiTree(source, ["app..users"], () => {}), /contains an invalid empty path segment/);
    assert.throws(() => apiTree(source, ["app.users."], () => {}), /contains an invalid empty path segment/);
    assert.throws(() => apiTree(source, [""], () => {}), /must not be an empty string/);
    assert.throws(() => apiTree(source, ["  "], () => {}), /must not be an empty string/);
});

test("v2: rejects invalid source, executor, and options", () => {
    assert.throws(() => apiTree(null, ["app.test"], () => {}), /source must be a JSON object/);
    assert.throws(() => apiTree([], ["app.test"], () => {}), /source must be a JSON object/);
    assert.throws(() => apiTree(source, ["app.test"], null), /executor must be a function/);
    assert.throws(() => apiTree(source, ["app.test"], () => {}, "badOptions"), /options must be an object/);
});
