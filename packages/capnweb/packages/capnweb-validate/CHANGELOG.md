# capnweb-validate

## 0.3.0

### Minor Changes

- [#253](https://github.com/skygenesisenterprise/zenthcloud) [`46de5a7`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - Fixed methods declared to return `Promise<RpcStub<T>>` producing broken stub-of-stub result types; they now type the same as `Promise<T>`. If you annotated such a result as `RpcPromise<RpcStub<T>>`, write `RpcPromise<T>` instead.

## 0.2.4

### Patch Changes

- [#240](https://github.com/skygenesisenterprise/zenthcloud) [`f7f7fa8`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@Maximo-Guk](https://github.com/Maximo-Guk)! - Ship `typescript` as a dependency (`>=5.7.0 <7`) instead of an uncapped peer, so the build-time transform keeps a JS-based compiler API in TypeScript 7 (tsgo) workspaces.

## 0.2.3

### Patch Changes

- [#227](https://github.com/skygenesisenterprise/zenthcloud) [`2b292e4`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@teamchong](https://github.com/teamchong)! - Ignore extra arguments past a method's declared parameters instead of refusing the call, and drop them before invoking the implementation.

## 0.2.2

### Patch Changes

- [#197](https://github.com/skygenesisenterprise/zenthcloud) [`0409821`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@teamchong](https://github.com/teamchong)! - Treat Workers `fetch` and `connect` lifecycle methods as passthrough methods on `WorkerEntrypoint` and `DurableObject` targets.

## 0.2.1

### Patch Changes

- [#194](https://github.com/skygenesisenterprise/zenthcloud) [`4093556`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@teamchong](https://github.com/teamchong)! - Fix `@validateRpc()` breaking decorated classes that extend other decorated classes: prototype methods are now wrapped in place instead of returning a Proxy from the constructor, so subclass-only methods validate correctly, instances stay real branded `RpcTarget`s, and incoming callback stubs pass through as native stubs (opt in to validating them with `validateStub<T>(stub)`).

## 0.2.0

### Minor Changes

- [#169](https://github.com/skygenesisenterprise/zenthcloud) [`2cb51eb`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@teamchong](https://github.com/teamchong)! - Introduced capnweb-validate, a separate package that allows you to wrap your RPC interfaces in runtime type-checking based on your TypeScript interfaces.
