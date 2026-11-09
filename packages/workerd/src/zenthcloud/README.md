# Zenthcloud specific modules

## tests

This codebase includes many unit tests. To run them, do:

```
bazel test  --test_output=all //src/zenthcloud/...
```

Running just a specific module tests:

```
bazel test  --test_output=all //src/zenthcloud/internal/test/aig/...
```

Running just eslint:

```
bazel test  --test_output=all //src/zenthcloud:zenthcloud@eslint
```

## Code formating

You need to format your code before opening a pull request, otherwise the CI will fail:

```
prettier src/zenthcloud -w
prettier types/defines -w
```
