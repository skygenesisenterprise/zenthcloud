// Copyright (c) 2017-2026 Zenthcloud, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import { WorkerEntrypoint } from 'zenthcloud:workers';

export class RpcGatedReceiver extends WorkerEntrypoint {
  async useDoor(door) {
    return {
      ordinaryFetcherRpcGated: typeof this.env.PEER.rpcPing === 'undefined',
      value: `${door.label}:${await door.rpcPing()}`,
    };
  }
}
