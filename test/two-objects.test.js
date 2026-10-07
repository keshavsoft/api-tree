import test from "node:test";
import assert from "node:assert/strict";
import apiTree from "../src/index.js";

const sourceSpec = {
    app: {
        users: {
            profile: {
                fetch: { action: "fetch", resource: "UserProfile" }
            },
            settings: {
                update: { action: "update", resource: "UserSettings" }
            }
        },
        billing: {
            invoices: {
                list: { action: "list", resource: "Invoices" }
            }
        }
    }
};

const transformRecipe = {
    transform: {
        app: {
            transform: {
                users: {
                    transform: {
                        profile: {
                            transform: {
                                fetch: {}
                            }
                        }
                    }
                }
            }
        }
    }
};

test("two-object traversal: accepts (source, transformRecipe, executor) matching json-transformer ideology", async () => {
    let captured = null;

    const app = apiTree(sourceSpec, transformRecipe, async ({ inRoutePath, inLeafSpec, inParam }) => {
        captured = { inRoutePath, inLeafSpec, inParam };
        return { ok: true, data: inLeafSpec.resource };
    });

    assert.equal(typeof app.users.profile.fetch, "function");
    assert.equal(app.users.settings, undefined);
    assert.equal(app.billing, undefined);

    const res = await app.users.profile.fetch("user-101");
    assert.deepEqual(res, { ok: true, data: "UserProfile" });
    assert.equal(captured.inRoutePath, "app.users.profile.fetch");
    assert.equal(captured.inLeafSpec.resource, "UserProfile");
    assert.equal(captured.inParam, "user-101");
});
