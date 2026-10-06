# api-tree

A small, zero-dependency runtime API-tree builder.

---

## The Story

Every domain application already knows two fundamental things: **what data it needs** (its schemas) and **how to get it** (its execution engine).

Yet in codebase after codebase, developers end up writing repetitive, brittle boilerplate code just to wire routes together. If you change a method path, you have to create nested object branches by hand, bind handler functions, and manage scope.

**`api-tree` was created to eliminate that entire layer of boilerplate.**

```text
source JSON + API paths + executor
                 ↓
              api-tree
                 ↓
       app.users.profile.fetch()
```

### The Core Idea

You declare your specifications in JSON. You list the allowable route paths. You provide a single execution function. `@keshavsoft/api-tree` automatically weaves them into a clean, callable dot-notation tree at runtime.

---

## Three Pure Responsibilities

By separating concerns, each component does exactly one job:

1. **`source`** — The domain contract. Contains the definitions, actions, metadata, and schemas.
2. **`apiPaths`** — The navigation blueprint. A flat array of allowed dotted route paths.
3. **`executor`** — The muscle. A function that actually carries out the operation (whether talking to an HTTP API, building TDL XML, querying a database, or reading disk).

`@keshavsoft/api-tree` does not know Tally, XML, HTTP, databases, or business rules. It only creates the navigable runtime surface.

---

## Why Separate It?

Because the routing engine is completely generic and reusable across different flavors:

- In **`tally-xml-tdl`**, the executor builds raw TDL XML and queries TallyPrime.
- In **`tally-simple-json`**, the executor cleans and transforms the response into pure JSON.
- In a **REST or GraphQL client**, the executor dispatches HTTP fetch requests.

None of those tools need to invent their own routing mechanism. They all share the same lean `@keshavsoft/api-tree` engine.

---

## Usage

```javascript
import apiTree from "@keshavsoft/api-tree";

// 1. Source JSON (the schema/metadata contract)
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

// 3. Executor Function
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

Invalid input produces a clear `TypeError` before the tree is built.

---

## License

MIT © [KeshavSoft](https://github.com/keshavsoft)
