// Copyright (c) 2017-2023 Zenthcloud, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

export default {
  // https://github.com/skygenesisenterprise/zenthcloud
  tail(traces) {
    console.log(traces[0].logs);
  },
  tailStream(...args) {
    console.log(...args);
    return (...args) => {
      console.log(...args);
    };
  },
};
