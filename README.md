# @keshavsoft/api-tree

[![npm version](https://img.shields.io/npm/v/@keshavsoft/api-tree.svg)](https://www.npmjs.com/package/@keshavsoft/api-tree)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://img.shields.io/badge/node-%3E%3D20.10-brightgreen.svg)]()

> A declarative, ultra-lean routing engine that transforms **Source Schemas**, **API Paths**, and an **Executor** into a callable runtime API tree.

---

## 💡 The Problem & Philosophy

In modern modular architectures, APIs often end up bloated because **schema contracts**, **route definitions**, and **runtime execution** are tangled together.

`@keshavsoft/api-tree` decouples these concerns completely:

$$\mathbf{Runtime\ Tree} = \underbrace{\mathbf{Source\ Schema}}_{\text{JSON Contract}} \;+\; \underbrace{\mathbf{API\ Paths}}_{\text{Dotted Routes}} \;+\; \underbrace{\mathbf{Executor}}_{\text{Execution Flavor}}$$

- **Domain-Agnostic**: Does not know about HTTP, XML, TDL, databases, or specific business logic.
- **Single Responsibility**: Generates the navigable runtime object tree from contracts and leaves execution to your handler.
- **Zero Dependencies**: Pure, modern ES module running at native speeds.

```text
┌─────────────────────────┐     ┌────────────────────────┐     ┌───────────────────────┐
│       Source JSON       │  +  │       API Paths        │  +  │       Executor        │
│ (Schema Specifications) │     │ (Dotted Route Strings) │     │ (Custom Handler Func) │
└───────────┬─────────────┘     └───────────┬────────────┘     └──────────┬────────────┘
            │                               │                             │
            └───────────────────────┬───────┴─────────────────────────────┘
                                    │
                                    ▼
                         @keshavsoft/api-tree
                                    │
                                    ▼
                       Callable Runtime API Tree
                     app.users.profile.fetch("123")
```

---

## 📦 Installation

```bash
npm install @keshavsoft/api-tree
```

---

## 🚀 Quick Start

```javascript
import apiTree from "@keshavsoft/api-tree";

// 1. Source JSON (the schema/metadata contract)
const source = {
    app: {
        users: {
            profile: {
                fetch: { action: "fetch", resource: "User", timeout: 5000 }
            }
        }
    }
};

// 2. Allowable API Paths
const apiPaths = [
    "app.users.profile.fetch"
];

// 3. Executor Function
const executor = async ({ inRoutePath, inParam, inLeafSpec }) => {
    console.log(`Executing ${inRoutePath} for ID: ${inParam}`);
    console.log("Leaf schema definition:", inLeafSpec);
    return { id: inParam, name: "Alice", action: inLeafSpec.action };
};

// 4. Build the callable tree
const api = apiTree(source, apiPaths, executor);

// 5. Call your generated tree!
const user = await api.users.profile.fetch("123");
console.log(user);
// => { id: "123", name: "Alice", action: "fetch" }
```

---

## ⚡ Key Features (v2)

### 1. Pre-Resolved Leaf Specification (`inLeafSpec`)
Your executor automatically receives the pre-resolved definition object directly from `source.json` under `inLeafSpec`. No need to write repetitive nested property access code!

### 2. Intelligent Root Handling
- **Single-Root Unwrapping**: When all paths share a common root namespace (e.g., `app.users.list`, `app.orders.create`), `api-tree` automatically unwraps the root so you call `api.users.list()` directly.
- **Multi-Root Preservation**: When paths span multiple top-level domains (e.g., `users.list` and `orders.create`), `api-tree` automatically preserves all top-level roots (`api.users.list()` and `api.orders.create()`).
- **Explicit Override**: You can pass `{ inUnwrapRoot: false }` to keep the root prefix intact.

### 3. Dual Signature Support
Supports both **positional** arguments and the **in-local named object** convention:

```javascript
// Positional
const api = apiTree(source, apiPaths, executor, options);

// Named Object
const api = apiTree({
    inSource: source,
    inApiPaths: apiPaths,
    inExecutor: executor,
    inOptions: { inUnwrapRoot: false }
});
```

### 4. Callable Hybrid Branches
If a path is both a callable node and has child branches (e.g. `api.users` and `api.users.profile`), `api-tree` attaches child branches directly onto the function:
```javascript
await api.users();         // Callable root!
await api.users.profile(); // Child leaf also callable!
```

---

## 📖 Execution Context Reference

Whenever an attached leaf function is invoked:
```javascript
await api.users.profile.fetch("param1", "extraArg1", "extraArg2");
```

Your `executor` receives a single, standardized context object:

| Property | Type | Description |
| :--- | :--- | :--- |
| `inRoutePath` | `string` | The full dot-notation route path (e.g. `"app.users.profile.fetch"`). |
| `inParam` | `any` | The primary argument passed to the leaf method. |
| `inArgs` | `any[]` | Array of all additional arguments passed beyond `inParam`. |
| `inLeafSpec` | `object \| undefined` | The resolved leaf definition object found in `source.json`. |
| `inSource` | `object` | The complete raw `source` schema object. |
| `inPathSegments` | `string[]` | Array of path segments (e.g. `["app", "users", "profile", "fetch"]`). |

---

## 🛡️ Input Validation & Error Handling

`@keshavsoft/api-tree` performs strict pre-flight validation to catch contract misconfigurations early:

- **`source`**: Must be a non-null plain JSON object (throws `TypeError: source must be a JSON object.`).
- **`apiPaths`**: Must be an array of non-empty strings without empty segments (e.g., `"users..fetch"` or `"users."` throws `TypeError`).
- **`executor`**: Must be a valid callable function (throws `TypeError: executor must be a function.`).

---

## 🌍 Real-World Architecture Examples

### Example A: Decoupling TallyPrime Runtimes
```javascript
import apiTree from "@keshavsoft/api-tree";
import { source, apiPaths } from "tally-spec";
import tallyXmlExecutor from "./tallyXmlExecutor.js";

// Generates app.masters.unit.all(), app.company.fetch(), etc.
const tally = apiTree(source, apiPaths, tallyXmlExecutor);
const units = await tally.masters.unit.all();
```

### Example B: Dynamic HTTP / REST Client
```javascript
import apiTree from "@keshavsoft/api-tree";

const endpoints = {
    api: {
        v1: {
            users: { get: { method: "GET", url: "/api/v1/users" } }
        }
    }
};

const client = apiTree(endpoints, ["api.v1.users.get"], async ({ inLeafSpec, inParam }) => {
    const res = await fetch(`${inLeafSpec.url}/${inParam}`, { method: inLeafSpec.method });
    return res.json();
});

const user = await client.v1.users.get(42);
```

---

## 🧪 Testing

The package includes a comprehensive test suite using Node's native test runner:

```bash
npm test
```

---

## 📄 License

MIT © [KeshavSoft](https://github.com/keshavsoft)
