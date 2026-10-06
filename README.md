# @keshavsoft/api-tree

A small runtime API-tree builder.

`@keshavsoft/api-tree` does one job: it takes **source JSON**, **API paths**, and an **executor**, then returns a callable runtime tree.

```text
source JSON
     +
API paths
     +
executor
     ↓
  api-tree
     ↓
callable API
```

## Usage

```js
import apiTree from "@keshavsoft/api-tree";

const source = {
    app: {
        users: {
            profile: {
                fetch: { action: "fetch", resource: "users" }
            }
        }
    }
};

const apiPaths = [
    "app.users.profile.fetch"
];

const executor = async ({ inRoutePath, inParam, inSource }) => {
    return {
        path: inRoutePath,
        param: inParam,
        spec: inSource.app.users.profile.fetch
    };
};

const api = apiTree(source, apiPaths, executor);

const result = await api.users.profile.fetch("123");
```

## Contract

`apiTree(source, apiPaths, executor)` accepts exactly three responsibilities:

1. **source** — the domain/source JSON object.
2. **apiPaths** — a flat array of API paths such as `app.users.profile.fetch`.
3. **executor** — the function that decides what the selected operation actually does.

`@keshavsoft/api-tree` does not know Tally, XML, HTTP, databases, or business rules.

## Validation

The public entry point checks:

- `source` is a JSON-compatible object.
- `apiPaths` is an array.
- every API path is a string.
- `executor` is a function.

Invalid input produces a clear `TypeError` before the tree is built.

## Blueprint examples

The package includes `src/v1/blueprint/source.json` and `src/v1/blueprint/api.json` as small reference examples. They are documentation/blueprint material, not hidden runtime configuration.

## Architecture

```text
Domain repository
    │
    ├── source.json
    ├── api.json
    └── execution code
             │
             │ source + paths + executor
             ▼
        @keshavsoft/api-tree
             │
             ▼
      callable runtime API
```

The domain repository owns the meaning and execution. `@keshavsoft/api-tree` only creates the navigable runtime surface.
