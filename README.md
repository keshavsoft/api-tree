# api-tree

A small, zero-dependency runtime API-tree builder.

---

## 💡 When Should You Use This?

`@keshavsoft/api-tree` is built specifically for systems where **most of the execution logic is identical** and handled by a **single core function**, while only a few parameters vary from endpoint to endpoint.

### The Problem It Solves

Consider an SDK or API client with 20, 50, or 200 endpoints. In most codebases, **95% of the work is identical across all of them**:
- Sending an HTTP POST or XML payload
- Setting headers and managing network timeouts
- Parsing envelopes and extracting data

The only thing that actually changes between `app.masters.unit.all()` and `app.company.fetch()` are a few variables: a resource name, a TDL query string, or a URL parameter.

Yet without `api-tree`, developers write dozens or hundreds of repetitive, hand-crafted wrapper functions just to call the exact same underlying function with different arguments:

```javascript
// ❌ The Anti-Pattern: 100 repetitive functions doing the exact same thing
export const getUnits = () => dispatchTally("<TYPE>Unit</TYPE>...");
export const getLedgers = () => dispatchTally("<TYPE>Ledger</TYPE>...");
export const getCompany = () => dispatchTally("<TYPE>Company</TYPE>...");
```

---

## 🚀 The api-tree Pattern: 1 Engine + Variable JSON

Instead of writing endless boilerplate wrappers, you separate concerns into three clean parts:

1. **One Single Executor**: You write your execution muscle exactly once. It knows how to send the request and handle responses.
2. **Variable Data in JSON (`source.json`)**: You define only the things that change (TDL queries, actions, resources, URLs) in a declarative schema.
3. **The Navigation List (`api.json`)**: You list the allowed routes in a flat, readable array.

```text
source JSON (Variables)  +  API paths (Routes)  +  executor (Single Function)
                                ↓
                             api-tree
                                ↓
                      Callable Runtime Tree
                    app.masters.unit.all()
```

When a new endpoint is needed, you don't write new JavaScript wrapper functions, manage imports, or test routing logic. **You simply add one entry to your JSON file.** `@keshavsoft/api-tree` binds your single executor to that new definition and instantly exposes it on the callable tree.

---

## Usage

```javascript
import apiTree from "@keshavsoft/api-tree";

// 1. Source JSON (the variable parameters)
const source = {
    app: {
        users: {
            profile: {
                fetch: { action: "fetch", resource: "User" }
            }
        }
    }
};

// 2. Allowable API Paths
const apiPaths = [
    "app.users.profile.fetch"
];

// 3. The Single Executor Function (handles 100% of execution)
const executor = async ({ inRoutePath, inLeafSpec, inParam }) => {
    return {
        path: inRoutePath,
        spec: inLeafSpec,
        id: inParam
    };
};

// 4. Build the callable tree
const app = apiTree(source, apiPaths, executor);

// 5. Call your generated tree!
const result = await app.users.profile.fetch("123");
```

---

## Execution Context

When an attached leaf function is invoked, your `executor` receives a single, standardized context object:

| Property | Type | Description |
| :--- | :--- | :--- |
| `inRoutePath` | `string` | The full dot-notation route path (e.g. `"app.users.profile.fetch"`). |
| `inParam` | `any` | The primary argument passed to the leaf method. |
| `inArgs` | `any[]` | Array of all additional arguments passed beyond `inParam`. |
| `inLeafSpec` | `object \| undefined` | The resolved leaf definition object found in `source.json`. |
| `inSource` | `object` | The complete raw `source` schema object. |
| `inPathSegments` | `string[]` | Array of path segments (e.g. `["app", "users", "profile", "fetch"]`). |

---

## Validation & Guarantees

`@keshavsoft/api-tree` performs strict pre-flight validation to catch contract misconfigurations early:

- **`source`**: Must be a non-null plain JSON object.
- **`apiPaths`**: Must be an array of non-empty strings with valid segments.
- **`executor`**: Must be a valid callable function.

---

## License

MIT © [KeshavSoft](https://github.com/keshavsoft)
