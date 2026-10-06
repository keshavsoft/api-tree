# API Reference

## `apiTree(source, apiPaths, executor)`

Builds and returns a callable runtime API tree.

### `source`

A JSON-compatible object containing the domain definitions.

### `apiPaths`

A flat array of dotted API paths.

```js
[
  "app.users.profile.fetch",
  "app.reports.summary.fetch"
]
```

Nested arrays or non-string path entries are rejected.

### `executor`

A function called when a generated leaf is invoked.

It receives:

```js
{
  inRoutePath,
  inParam,
  inSource
}
```

### Return value

A callable object representing the API paths.
