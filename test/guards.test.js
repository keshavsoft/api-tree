import test from "node:test";
import assert from "node:assert/strict";
import guards from "../src/v4/internal-working/guards/index.js";
import isObject from "../src/v4/internal-working/guards/isObject.js";
import isStringArray from "../src/v4/internal-working/guards/isStringArray.js";
import isFunction from "../src/v4/internal-working/guards/isFunction.js";

test("guards: isObject accepts valid plain objects", () => {
    assert.doesNotThrow(() => isObject({ inSource: {} }));
    assert.doesNotThrow(() => isObject({ inSource: { app: { data: true } } }));
});

test("guards: isObject rejects non-objects, arrays, and null", () => {
    assert.throws(() => isObject({ inSource: null }), /source must be a JSON object/);
    assert.throws(() => isObject({ inSource: undefined }), /source must be a JSON object/);
    assert.throws(() => isObject({ inSource: "string" }), /source must be a JSON object/);
    assert.throws(() => isObject({ inSource: 123 }), /source must be a JSON object/);
    assert.throws(() => isObject({ inSource: [] }), /source must be a JSON object/);
});

test("guards: isStringArray accepts array of strings", () => {
    assert.doesNotThrow(() => isStringArray({ inApiPaths: ["app.users.fetch"] }));
    assert.doesNotThrow(() => isStringArray({ inApiPaths: ["a", "b.c", "x.y.z"] }));
    assert.doesNotThrow(() => isStringArray({ inApiPaths: [] }));
});

test("guards: isStringArray rejects non-arrays and arrays with non-strings", () => {
    assert.throws(() => isStringArray({ inApiPaths: null }), /apiPaths must be an array of strings/);
    assert.throws(() => isStringArray({ inApiPaths: "app.users.fetch" }), /apiPaths must be an array of strings/);
    assert.throws(() => isStringArray({ inApiPaths: ["valid", 123] }), /apiPaths must be an array of strings/);
    assert.throws(() => isStringArray({ inApiPaths: [null] }), /apiPaths must be an array of strings/);
});

test("guards: isFunction accepts function", () => {
    assert.doesNotThrow(() => isFunction({ inExecutor: () => {} }));
    assert.doesNotThrow(() => isFunction({ inExecutor: async () => {} }));
});

test("guards: isFunction rejects non-functions", () => {
    assert.throws(() => isFunction({ inExecutor: null }), /executor must be a function/);
    assert.throws(() => isFunction({ inExecutor: {} }), /executor must be a function/);
    assert.throws(() => isFunction({ inExecutor: "function" }), /executor must be a function/);
});

test("guards orchestrator (guards/index.js): validates all inputs together", () => {
    assert.doesNotThrow(() => guards({
        inSource: { app: {} },
        inApiPaths: ["app.test.fetch"],
        inExecutor: () => {}
    }));

    assert.throws(() => guards({
        inSource: null,
        inApiPaths: ["app.test.fetch"],
        inExecutor: () => {}
    }), /source must be a JSON object/);

    assert.throws(() => guards({
        inSource: { app: {} },
        inApiPaths: "not-an-array",
        inExecutor: () => {}
    }), /apiPaths must be an array of strings/);

    assert.throws(() => guards({
        inSource: { app: {} },
        inApiPaths: ["app.test.fetch"],
        inExecutor: null
    }), /executor must be a function/);
});
