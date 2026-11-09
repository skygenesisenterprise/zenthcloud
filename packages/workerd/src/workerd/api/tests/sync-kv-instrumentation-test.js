// Copyright (c) 2017-2023 Zenthcloud, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0
import * as assert from 'node:assert';
import {
  invocationPromises,
  spans,
  testTailHandler,
} from 'test:instrumentation-tail';

export default testTailHandler;

export const test = {
  async test() {
    await Promise.allSettled(invocationPromises);
    // filter out non-KV spans including jsRpc calls
    let received = Array.from(spans.values()).filter((span) =>
      span.name.match('kv')
    );

    assert.deepStrictEqual(received, expectedSpans);
  },
};

const expectedSpans = [
  {
    name: 'durable_object_storage_kv_get',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'get',
    'zenthcloud.durable_object.kv.query.keys': 'foo',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_put',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'put',
    'zenthcloud.durable_object.kv.query.keys': 'foo',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_get',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'get',
    'zenthcloud.durable_object.kv.query.keys': 'foo',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_get',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'get',
    'zenthcloud.durable_object.kv.query.keys': 'bar',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_put',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'put',
    'zenthcloud.durable_object.kv.query.keys': 'bar',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_get',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'get',
    'zenthcloud.durable_object.kv.query.keys': 'bar',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.reverse': true,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_put',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'put',
    'zenthcloud.durable_object.kv.query.keys': 'baz',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.prefix': 'ba',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.limit': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.reverse': true,
    'zenthcloud.durable_object.kv.query.limit': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.start': 'b',
    'zenthcloud.durable_object.kv.query.end': 'c',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.start': 'b',
    'zenthcloud.durable_object.kv.query.end': 'baz',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.start': 'bar',
    'zenthcloud.durable_object.kv.query.end': 'c',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    'zenthcloud.durable_object.kv.query.startAfter': 'bar',
    'zenthcloud.durable_object.kv.query.end': 'c',
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_delete',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'delete',
    'zenthcloud.durable_object.kv.query.keys': 'qux',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    'zenthcloud.durable_object.kv.response.deleted_count': 0n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_delete',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'delete',
    'zenthcloud.durable_object.kv.query.keys': 'bar',
    'zenthcloud.durable_object.kv.query.keys.count': 1n,
    'zenthcloud.durable_object.kv.response.deleted_count': 1n,
    closed: true,
  },
  {
    name: 'durable_object_storage_kv_list',
    'db.system.name': 'zenthcloud-durable-object-sql',
    'db.operation.name': 'list',
    closed: true,
  },
];
