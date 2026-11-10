# ZenthCloud Speedtest

[![npm](https://img.shields.io/npm/v/@zenthcloud/speedtest.svg)](https://www.npmjs.com/package/@zenthcloud/speedtest)
[![License](https://img.shields.io/badge/License-see%20repository-lightgrey)](https://github.com/skygenesisenterprise/zenthcloud)
[![TypeScript](https://img.shields.io/badge/TypeScript-browser--only-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)

> A browser-side measurement engine for Internet connection quality.

**`@zenthcloud/speedtest`** is a JavaScript module that measures the quality of a client's Internet connection. It is the measurement engine that powers the ZenthCloud speedtest measurement application. The module performs test requests against the [ZenthCloud](https://github.com/skygenesisenterprise/zenthcloud) edge network and relies on the [PerformanceResourceTiming browser API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming) to extract timing results.

The network connection is characterized by items such as download/upload bandwidth, latency and packet loss.

**Perfect for:** browser applications that need connection quality measurements, network diagnostics, and products that want to score a connection for streaming, gaming or real-time communication.

> Please note that measurement results are collected by ZenthCloud on completion for the purpose of calculating aggregated insights regarding Internet connection quality.

## Contents

- [ZenthCloud Speedtest](#zenthcloud-speedtest)
  - [Contents](#contents)
  - [Why ZenthCloud Speedtest matters](#why-zenthcloud-speedtest-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
  - [API reference](#api-reference)
    - [Instantiation](#instantiation)
    - [Attributes](#attributes)
    - [Methods](#methods)
    - [Notification events](#notification-events)
    - [Measurement config](#measurement-config)
      - [latency](#latency)
      - [download / upload](#download--upload)
      - [packetLoss](#packetloss)
    - [Results object](#results-object)
  - [How ZenthCloud Speedtest is built](#how-zenthcloud-speedtest-is-built)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why ZenthCloud Speedtest matters

🎯 **Real measurements** — Uses actual requests against the edge network and browser timing APIs rather than synthetic estimates.

🚀 **Latency, bandwidth and loss** — Measures unloaded and loaded latency, download and upload bandwidth, and packet loss.

📦 **Configurable** — Measurement targets, paths and the full measurement sequence can be customized.

🔒 **Browser-only by construction** — The package avoids Node-only APIs and runs in modern browsers.

🧩 **Composable results** — A results object exposes raw points and reduced values, plus AIM scores for common use cases.

## What you can do

- Measure latency, jitter, download bandwidth and upload bandwidth.
- Measure loaded latency during download and upload.
- Measure packet loss through a WebRTC TURN server.
- Control the sequence and size of measurements.
- Read summary values, raw data points and connection scores.
- React to progress with event callbacks.

## Quick start

Add the package to your `package.json`:

```bash
npm install @zenthcloud/speedtest
```

```js
import SpeedTest from '@zenthcloud/speedtest';

new SpeedTest().onFinish = results => console.log(results.getSummary());
```

## API reference

`SpeedTest` is a JavaScript class and should be instantiated with the `new` keyword. It is not required to pass a config object, as all items have default values.

### Instantiation

```js
new SpeedTest({ configOptions })
```

Options marked 🧪 are **experimental and unstable**: they may change behaviour, be renamed, or be removed in any release, including a patch. Do not depend on them.

| Config option | Description | Default |
| --- | --- | :--: |
| **autoStart**: *boolean* | Whether to automatically start the measurements on instantiation. | `true` |
| **measurementTargets**: *string[]* | The origins to send latency, download and upload requests to, at `measurementDownloadPath` and `measurementUploadPath`. The test iterates over the targets. When empty, `downloadApiUrl` and `uploadApiUrl` are used instead. An entry that isn't a bare `http(s)` origin throws a `TypeError` when the engine is created. Targets on a different origin from the page must send a `Timing-Allow-Origin` header: requests to a target without it are reported through `onError` and skipped. | `[]` |
| **measurementDownloadPath**: *string* | The path for latency and download requests on each of the `measurementTargets`. It may include a query string. A path that doesn't start with `/` throws a `TypeError` when the engine is created. | `/__down` |
| **measurementUploadPath**: *string* | The path for upload requests on each of the `measurementTargets`. It may include a query string. A path that doesn't start with `/` throws a `TypeError` when the engine is created. | `/__up` |
| **downloadApiUrl**: *string* | *Deprecated: use `measurementTargets`.* The URL of the API for performing download GET requests, used when `measurementTargets` is empty. | `https://github.com/skygenesisenterprise/zenthcloud` |
| **uploadApiUrl**: *string* | *Deprecated: use `measurementTargets`.* The URL of the API for performing upload POST requests, used when `measurementTargets` is empty. | `https://github.com/skygenesisenterprise/zenthcloud` |
| **turnServerUri**: *string* | The URI of the TURN server used to measure packet loss, e.g. `turn.zenthcloud.com:3478`. See [packetLoss](#packetloss). | `null` |
| **turnServerCredsApiUrl**: *string* | A URI that returns TURN server credentials. Expects a JSON response with `username` and `credential` keys. See [packetLoss](#packetloss). | `null` |
| **turnServerUser**: *string* | The username for the TURN server credentials. | - |
| **turnServerPass**: *string* | The password for the TURN server credentials. | - |
| **authorizationToken**: *string* | 🧪 *Experimental.* An opaque token attributing the test to a registered customer, sent as an `Authorization: Bearer` header on the measurement, TURN credential and results-logging requests. Obtain it from your own backend — the engine never requests one itself. Requires `authorizationEnabled`; on its own it is never sent. Not sent over plain HTTP unless `allowInsecureAuthorizationToken` is set. | `null` |
| **authorizationEnabled**: *`'header'` \| boolean* | 🧪 *Experimental.* Opts in to sending `authorizationToken`, which is otherwise withheld even when set. `'header'` and `true` both send it as `Authorization: Bearer`; `true` is a permanent alias for `'header'`, so a future transport can be added without changing what an existing config does. | `undefined` |
| **allowInsecureAuthorizationToken**: *boolean* | 🧪 *Experimental.* Sends `authorizationToken` even when the endpoint is not HTTPS, for local development against an `http://` server. Never enable this in production: the server treats a token seen over plaintext as compromised and revokes it. | `false` |
| **measurements**: *array* | The sequence of measurements to perform by the speedtest engine. See [below](#measurement-config) for the specific syntax of this option. | |
| **measureDownloadLoadedLatency**: *boolean* | Whether to perform additional latency measurements simultaneously with download requests, to measure loaded latency (during download). | `true` |
| **measureUploadLoadedLatency**: *boolean* | Whether to perform additional latency measurements simultaneously with upload requests, to measure loaded latency (during upload). | `true` |
| **loadedLatencyThrottle**: *number* | Time interval to wait in between loaded latency requests (in milliseconds). | 400 |
| **bandwidthFinishRequestDuration**: *number* | The minimum duration (in milliseconds) to reach in download/upload measurement sets for halting further measurements with larger file sizes in the same direction. | 1000 |
| **abortRequestDuration**: *number* | The maximum duration (in milliseconds) of a single request. Requests that take longer are aborted and skipped. `bandwidthAbortRequestDuration` is a deprecated alias. | 0 (disabled) |
| **abortTestDuration**: *number* | The maximum running time (in milliseconds, excluding paused time) of the whole test. When it's reached, the test ends with the results collected so far. | 0 (disabled) |
| **estimatedServerTime**: *number* | If the download/upload APIs do not return a `server-timing` response header containing the time spent in the server, this fixed value (in milliseconds) will be subtracted from all time-to-first-byte calculations. | 0 |
| **latencyPercentile**: *number* | The percentile (between 0 and 1) used to calculate latency from a set of measurements. | 0.5 |
| **bandwidthPercentile**: *number* | The percentile (between 0 and 1) used to calculate bandwidth from a set of measurements. | 0.9 |
| **bandwidthMinRequestDuration**: *number* | The minimum duration (in milliseconds) of a request to consider a measurement good enough to use in the bandwidth calculation. | 10 |
| **loadedRequestMinDuration**: *number* | The minimum duration (in milliseconds) of a request to consider it to be loading the connection. | 250 |
| **loadedLatencyMaxPoints**: *number* | The maximum number of data points to keep for loaded latency measurements. When more than this amount are available, the latest ones are kept. | 20 |

### Attributes

| Attribute | Description |
| --- | --- |
| **results**: *[Results](#results-object)* | Getter of the current test results object. May yield incomplete values if the test is still running. |
| **isRunning**: *boolean* | Getter of whether the test engine is currently running. |
| **isFinished**: *boolean* | Getter of whether the test engine has finished all the measurements, and the results are considered final. |

### Methods

| Method | Description |
| --- | --- |
| **play()** | Starts or resumes the measurements. Does nothing if the engine is already running or is finished. |
| **pause()** | Pauses the measurements. Does nothing if the engine is already paused or is finished. |
| **restart()** | Clears the current results and restarts the measurements from the beginning. |

### Notification events

| Event method | Arguments | Description |
| --- | --- | --- |
| **onRunningChange** | running: *boolean* | Invoked whenever the test engine starts or stops. The current state is included as a function argument. |
| **onResultsChange** | { type: *string* } | Invoked whenever any item changes in the results, usually indicating the completion of a measurement. The type of measurement that changed is included as an info attribute in the function argument. |
| **onFinish** | results: *[Results](#results-object)* | Invoked when the test ends, with the results object collected so far as a function argument. |
| **onError** | error: *string*, status: *number \| undefined* | Invoked whenever an error occurs during one of the measurements, with the HTTP status when available. Most errors don't stop the test; call `pause()` from this callback to stop it. |

### Measurement config

The specific measurements to be performed by the test engine, and their sequence, can be customized using the `measurements` config option. This should be an array of objects, each with a `type` field, plus additional fields specific to that measurement type.

The default set of measurements is:

```js
[
  { type: 'latency', numPackets: 1 }, // initial latency estimation
  { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true }, // initial download estimation
  { type: 'latency', numPackets: 20 },
  { type: 'download', bytes: 1e5, count: 9 },
  { type: 'download', bytes: 1e6, count: 8 },
  { type: 'upload', bytes: 1e5, count: 8 },
  { type: 'upload', bytes: 1e6, count: 6 },
  { type: 'download', bytes: 1e7, count: 6 },
  { type: 'upload', bytes: 1e7, count: 4 },
  { type: 'download', bytes: 2.5e7, count: 4 },
  { type: 'upload', bytes: 2.5e7, count: 4 },
  { type: 'download', bytes: 1e8, count: 3 },
  { type: 'upload', bytes: 5e7, count: 3 },
  { type: 'download', bytes: 2.5e8, count: 2 }
]
```

Here are the fields available per measurement type:

#### latency

| Field | Required | Description | Default |
| --- | :--: | --- | :--: |
| **numPackets**: *number* | yes | The number of latency GET requests to perform. These requests are performed against the download API with `bytes=0`, and then the round-trip time-to-first-byte timing between `requestStart` and `responseStart` is extracted. | - |

#### download / upload

Each of these measurement sets is bound to a specific file size. The engine follows a ramp-up methodology per direction (download or upload). Whenever there are multiple measurement sets (with increasing file sizes) for a direction, the engine keeps performing them until it reaches the condition specified by `bandwidthFinishRequestDuration`, at which point further sets in the same direction are ignored.

| Field | Required | Description | Default |
| --- | :--: | --- | :--: |
| **bytes**: *number* | yes | The file size to request from the download API, or post to the upload API. The bandwidth (calculated as bits per second, or bps) for each request is calculated by dividing the `transferSize` (in bits) by the request duration (excluding the server processing time). Durations are measured from the final response headers where the browser reports them (`finalResponseHeadersStart`), so interim `1xx` responses do not shorten them. | - |
| **count**: *number* | yes | The number of requests to perform for this file size. A request whose reported duration is zero or negative, or that has no resource timing entry, has no measurable bandwidth: it still counts towards `count`, but is discarded from the results with a console warning, so a set can return fewer data points than requested. If three requests in a row within one measurement set have no resource timing entry, the test ends with the results collected so far, and reports it through `onError`. | - |
| **bypassMinDuration**: *boolean* | no | Whether the `bandwidthFinishRequestDuration` check should be ignored, and the engine is instructed to proceed with the measurements of this direction in any case. | `false` |

#### packetLoss

Packet loss is measured by submitting a set of UDP packets to a WebRTC TURN server in a round-trip fashion, and determining how many packets do not arrive. The submission of these packets can be done in a batching method, in which there's a sleep time in between batches.

Packet loss is opt-in: it is not part of the default measurements, and it needs your own TURN server configuration. To enable it, add a `packetLoss` measurement and either:

- set `turnServerCredsApiUrl` to an endpoint you host that returns TURN credentials, plus `turnServerUri` (e.g. `turn.zenthcloud.com:3478`) unless the endpoint also returns a `server` field, or
- set `turnServerUri` together with your own `turnServerUser` and `turnServerPass`.

```js
new SpeedTest({
  turnServerUri: 'turn.zenthcloud.com:3478',
  turnServerCredsApiUrl: 'https://turn.example.com/turn-credentials',
  measurements: [
    // ...
    { type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 }
  ]
});
```

A `packetLoss` measurement without either option fails with an error, and the engine moves on to the next measurement.

Example code to serve TURN credentials from a ZenthCloud Worker, using a [ZenthCloud Realtime TURN server](https://github.com/skygenesisenterprise/zenthcloud), is available at [example/turn-worker](example/turn-worker). Refer to the worker's [documentation](example/turn-worker/README.md) for setup and deployment instructions.

| Field | Required | Description | Default |
| --- | :--: | --- | :--: |
| **numPackets**: *number* | no | The total number of UDP packets to send. | 100 |
| **responsesWaitTime**: *number* | no | The interval of time (in milliseconds) to wait after the latest packet reception before determining the measurement as complete, and all non-returned packets as lost. | 5000 |
| **batchSize**: *number* | no | The number of packets in a batch. If this value is higher than `numPackets` there will be only one batch. | 10 |
| **batchWaitTime**: *number* | no | How long to wait (in milliseconds) between batches. | 10 |
| **connectionTimeout**: *number* | no | Timeout for the connection to the TURN server. | 5000 |

### Results object

An instance object used to access the results of the speedtest measurements. The following methods are available:

| Method | Description |
| --- | --- |
| **getSummary()** | Returns a high-level summary object with the computed results from the performed measurements. |
| **getUnloadedLatency()** | Returns the reduced value of the connection latency while at idle. Requires at least one `latency` measurement. |
| **getUnloadedJitter()** | Returns the connection jitter while at idle. Jitter is calculated as the average distance between consecutive latency measurements. Requires at least two `latency` measurements. |
| **getUnloadedLatencyPoints()** | Returns an array with all the latencies measured while at idle. Includes one value per measurement in sequence. |
| **getDownLoadedLatency()** | Returns the reduced value of the connection latency while loaded in the download direction. Requires `measureDownloadLoadedLatency` to be enabled. |
| **getDownLoadedJitter()** | Returns the connection jitter while loaded in the download direction. Requires `measureDownloadLoadedLatency` to be enabled, and at least two loaded latency measurements. |
| **getDownLoadedLatencyPoints()** | Returns an array with all the latencies measured while loaded in the download direction. Includes one value per loaded measurement in sequence. Requires `measureDownloadLoadedLatency` to be enabled. |
| **getUpLoadedLatency()** | Returns the reduced value of the connection latency while loaded in the upload direction. Requires `measureUploadLoadedLatency` to be enabled. |
| **getUpLoadedJitter()** | Returns the connection jitter while loaded in the upload direction. Requires `measureUploadLoadedLatency` to be enabled, and at least two loaded latency measurements. |
| **getUpLoadedLatencyPoints()** | Returns an array with all the latencies measured while loaded in the upload direction. Includes one value per loaded measurement in sequence. Requires `measureUploadLoadedLatency` to be enabled. |
| **getDownloadBandwidth()** | Returns the reduced value of the download bandwidth (in bps). Requires at least one `download` measurement, longer than the `bandwidthMinRequestDuration` threshold. |
| **getDownloadBandwidthPoints()** | Returns an array with all the download measurement results. Each item includes `{ bytes, bps, duration, ping, measTime, serverTime, transferSize }`. |
| **getUploadBandwidth()** | Returns the reduced value of the upload bandwidth (in bps). Requires at least one `upload` measurement, longer than the `bandwidthMinRequestDuration` threshold. |
| **getUploadBandwidthPoints()** | Returns an array with all the upload measurement results. Each item includes `{ bytes, bps, duration, ping, measTime, serverTime, transferSize }`. |
| **getPacketLoss()** | Returns the reduced value of the measured packet loss ratio (between 0 and 1). Requires a `packetLoss` measurement set. |
| **getPacketLossDetails()** | Returns an object with the details of the packet loss measurement. Includes `{ packetLoss, totalMessages, numMessagesSent, lostMessages }`. Requires a `packetLoss` measurement set. |
| **getTotalDurationMs()** | Returns the total time (in milliseconds) the engine spent running, excluding any time spent paused. Only available after the engine has finished. |
| **getScores()** | Returns the computed [AIM scores](https://github.com/skygenesisenterprise/zenthcloud) that categorize the quality of the network connection according to use cases such as streaming, gaming or real-time communications. This score is only available after the engine has finished performing all of the measurements. Without a `packetLoss` measurement, packet loss is left out of the scores, so they come out lower than for a connection measured with under 5% loss. A failed `packetLoss` measurement counts as 0 points. |

## How ZenthCloud Speedtest is built

The package is a browser-only TypeScript library with zero runtime dependencies. It ships ESM output and auto-generated declarations.

| Area | Location | Role |
| --- | --- | --- |
| Entry point | `src/index.ts` | Exports `LoggingMeasurementEngine`, which wraps `MeasurementEngine` |
| Config | `src/config/` | Default config and AIM scoring thresholds |
| Engines | `src/engines/` | Bandwidth, packet loss, load network and reachability engines |
| Results | `src/Results/` | Aggregation, statistics and AIM scoring |
| Utilities | `src/utils/` | Math, measurement targets and authorization helpers |

The bandwidth engine uses `fetch` and `PerformanceResourceTiming`. The packet loss engine uses a WebRTC TURN relay. Source and tests are TypeScript, and the build uses `tsdown`.

## Development

```bash
pnpm install
pnpm build
pnpm dev
pnpm lint
pnpm format
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm test:watch
```

To run e2e tests locally, install the browsers first:

```bash
npx playwright install chromium webkit
```

## FAQ

### Does it work in Node.js?

No. The library is browser-only and relies on `fetch`, `PerformanceResourceTiming`, `RTCPeerConnection` and `performance.now()`. `lib` is `["ES2022", "DOM", "DOM.Iterable"]`, and `@types/node` is deliberately absent.

### Are there runtime dependencies?

No. The package has zero runtime dependencies and is ESM-only.

### How do I measure packet loss?

Add a `packetLoss` measurement and configure a TURN server either through `turnServerCredsApiUrl` or `turnServerUser`/`turnServerPass` with `turnServerUri`.

### Why is a measurement missing from the results?

A request with zero or negative duration, or no resource timing entry, has no measurable bandwidth. It counts toward `count` but is discarded with a console warning.

## Related resources

- Package: [`packages/speedtest`](packages/speedtest)
- Measurement targets and configuration: [`src/config/`](src/config/)
- TURN worker example: [example/turn-worker](example/turn-worker)
- PerformanceResourceTiming: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating. Do not push directly to `main`; all changes go through a pull request.

## Security

The authorization token is experimental. Never enable `allowInsecureAuthorizationToken` in production; a token seen over plaintext is treated as compromised and revoked. Do not report security vulnerabilities in public issues; follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

See the repository [LICENSE](https://github.com/skygenesisenterprise/zenthcloud) for licensing terms.

## Note

ZenthCloud Speedtest is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
