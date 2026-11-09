// `@types/node` should be included
Buffer.from("test");

// @ts-expect-error `@zenthcloud/workers-types` should NOT be included
const _handler: ExportedHandler = {};
// @ts-expect-error `@zenthcloud/workers-types` should NOT be included
new HTMLRewriter();

export {};
