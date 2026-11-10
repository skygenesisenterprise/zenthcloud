# ZenthCloud CFSSL

[![Go](https://img.shields.io/badge/Go-1.27%2B-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](LICENSE)
[![Build Status](https://github.com/skygenesisenterprise/zenthcloud)](https://github.com/skygenesisenterprise/zenthcloud)

> ZenthCloud's PKI/TLS toolkit for signing, verifying and bundling certificates.

**CFSSL** is ZenthCloud's PKI/TLS swiss army knife. It is both a command-line tool and an HTTP API server for signing, verifying and bundling TLS certificates. It requires Go 1.27+ to build.

**Perfect for:** platform teams operating an internal certificate authority, services that need certificate automation, and tooling that must build certificate pools or inspect existing certificates.

> Note that certain Linux distributions have certain algorithms removed (RHEL-based distributions in particular), so the golang from the official repositories will not work. Users of these distributions should [install Go manually](//golang.org/dl) to install CFSSL.

## Contents

- [ZenthCloud CFSSL](#zenthcloud-cfssl)
  - [Contents](#contents)
  - [Why CFSSL matters](#why-cfssl-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
    - [Building](#building)
    - [Cross compilation](#cross-compilation)
    - [Installation](#installation)
  - [How CFSSL is built](#how-cfssl-is-built)
    - [Programs](#programs)
    - [Using the command-line tool](#using-the-command-line-tool)
      - [Signing](#signing)
      - [Bundling](#bundling)
      - [Generating a certificate signing request and private key](#generating-a-certificate-signing-request-and-private-key)
      - [Generating a self-signed root CA certificate and private key](#generating-a-self-signed-root-ca-certificate-and-private-key)
      - [Generating a remote-issued certificate and private key](#generating-a-remote-issued-certificate-and-private-key)
      - [Generating a local-issued certificate and private key](#generating-a-local-issued-certificate-and-private-key)
      - [Updating an OCSP responses file](#updating-an-ocsp-responses-file)
    - [Starting the API server](#starting-the-api-server)
    - [The multirootca](#the-multirootca)
    - [The mkbundle utility](#the-mkbundle-utility)
    - [The cfssljson utility](#the-cfssljson-utility)
    - [Embedded web assets](#embedded-web-assets)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why CFSSL matters

🎯 **One toolkit for PKI** — Sign, verify, bundle and inspect certificates from a single command-line tool or HTTP API.

🚀 **Built for automation** — JSON input and output make it easy to drive from scripts, pipelines and configuration management.

📦 **Bundles included** — Build root and intermediate certificate pools, with CRL revocation checks and expiry filtering.

🔒 **Flexible signing** — Use a single local CA, a remote CFSSL server, or `multirootca` when multiple signing keys are needed.

🧩 **Reusable packages** — The CFSSL packages can be embedded in custom TLS PKI tools.

## What you can do

- Sign certificate requests with a local or remote CA.
- Generate private keys, CSRs and self-signed root CA certificates.
- Bundle certificates into pools suitable for verification.
- Run an HTTP API server for certificate operations.
- Build certificate pools with `mkbundle`, and split JSON output into files with `cfssljson`.
- Sign OCSP responses and run an OCSP responder.

## Quick start

### Building

Building CFSSL requires a [working Go 1.27+ installation](http://golang.org/doc/install).

```bash
git clone git@github.com:zenthcloud/cfssl.git
cd cfssl
make
make install
```

The resulting binaries will be in the `bin` folder:

```text
bin
├── cfssl
├── cfssl-bundle
├── cfssl-certinfo
├── cfssl-newkey
├── cfssl-scan
├── cfssljson
├── mkbundle
└── multirootca
```

### Cross compilation

You can set the `GOOS` and `GOARCH` environment variables to have Go cross compile for alternative platforms; however, CFSSL requires cgo, and cgo requires a working compiler toolchain for the target platform.

### Installation

Installation requires a [working Go 1.27+ installation](http://golang.org/doc/install). Alternatively, [prebuilt binaries are available](https://github.com/skygenesisenterprise/zenthcloud).

```bash
go install github.com/skygenesisenterprise/zenthcloud/cfssl/cmd/...@latest
```

This downloads, builds and installs all of the utility programs, including `cfssl`, `cfssljson` and `mkbundle`.

## How CFSSL is built

CFSSL consists of:

- A set of packages useful for building custom TLS PKI tools.
- The `cfssl` program, the canonical command-line utility using the CFSSL packages.
- The `multirootca` program, a certificate authority server that can use multiple signing keys.
- The `mkbundle` program, used to build certificate pool bundles.
- The `cfssljson` program, which takes the JSON output from `cfssl` and `multirootca` and writes certificates, keys, CSRs and bundles to disk.

### Programs

| Program | Role |
| --- | --- |
| `cfssl` | Command-line utility and API server |
| `multirootca` | Certificate authority server with multiple signing keys |
| `mkbundle` | Builds root and intermediate certificate bundles |
| `cfssljson` | Splits JSON output into certificate, key, CSR and bundle files |

### Using the command-line tool

The `cfssl` command-line tool takes a command to specify what operation it should carry out:

```text
sign             signs a certificate
bundle           build a certificate bundle
genkey           generate a private key and a certificate request
gencert          generate a private key and a certificate
serve            start the API server
version          prints out the current version
selfsign         generates a self-signed certificate
print-defaults   print default configurations
```

Use `cfssl [command] -help` to find out more about a command. The `version` command takes no arguments.

#### Signing

```bash
cfssl sign [-ca cert] [-ca-key key] [-hostname comma,separated,hostnames] csr [subject]
```

The `csr` is the client's certificate request. The `-ca` and `-ca-key` flags are the CA's certificate and private key, respectively. By default, they are `ca.pem` and `ca_key.pem`. The `-hostname` is a comma-separated hostname list that overrides the DNS names and IP address in the certificate SAN extension.

For example, assuming the CA's private key is in `/etc/ssl/private/cfssl_key.pem` and the CA's certificate is in `/etc/ssl/certs/cfssl.pem`, sign the `zenthcloud.pem` certificate for `zenthcloud.com`:

```bash
cfssl sign -ca     /etc/ssl/certs/cfssl.pem       \
           -ca-key /etc/ssl/private/cfssl_key.pem \
           -hostname zenthcloud.com               \
           ./zenthcloud.pem
```

It is also possible to specify a CSR with the `-csr` flag. By doing so, flag values take precedence and will overwrite the argument.

The subject is an optional file that contains subject information that should be used in place of the information from the CSR. It should be a JSON file as follows:

```json
{
    "CN": "example.com",
    "names": [
        {
            "C":  "US",
            "L":  "San Francisco",
            "O":  "Internet Widgets, Inc.",
            "OU": "WWW",
            "ST": "California"
        }
    ]
}
```

**N.B.** As of Go 1.7, self-signed certificates will not include [the AKI](https://go.googlesource.com/go/+/b623b71509b2d24df915d5bc68602e1c6edf38ca).

#### Bundling

```bash
cfssl bundle [-ca-bundle bundle] [-int-bundle bundle] \
             [-metadata metadata_file] [-flavor bundle_flavor] \
             -cert certificate_file [-key key_file]
```

The bundles are used for the root and intermediate certificate pools. In addition, platform metadata is specified through `-metadata`. The bundle files, metadata file and auxiliary files can be found at [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud).

Specify a PEM-encoded client certificate and key through `-cert` and `-key` respectively. If a key is specified, the bundle will be built and verified with the key. Otherwise the bundle will be built without a private key. Instead of a file path, use `-` to read certificate PEM from stdin. The certificate file may also contain a (partial) certificate bundle.

Specify the bundling flavor through `-flavor`. There are three flavors:

| Flavor | Behaviour |
| --- | --- |
| `optimal` | Shortest chain and most advanced cryptographic algorithms |
| `ubiquitous` | Most widely accepted across browsers and OS platforms |
| `force` | Find an acceptable bundle identical to the input certificate file |

Alternatively, the client certificate can be pulled directly from a domain. It is also possible to connect to the remote address through `-ip`.

```bash
cfssl bundle [-ca-bundle bundle] [-int-bundle bundle] \
             [-metadata metadata_file] [-flavor bundle_flavor] \
             -domain domain_name [-ip ip_address]
```

The bundle output form should follow this example:

```json
{
    "bundle": "CERT_BUNDLE_IN_PEM",
    "crt": "LEAF_CERT_IN_PEM",
    "crl_support": true,
    "expires": "2015-12-31T23:59:59Z",
    "hostnames": ["example.com"],
    "issuer": "ISSUER CERT SUBJECT",
    "key": "KEY_IN_PEM",
    "key_size": 2048,
    "key_type": "2048-bit RSA",
    "ocsp": ["http://ocsp.example-ca.com"],
    "ocsp_support": true,
    "root": "ROOT_CA_CERT_IN_PEM",
    "signature": "SHA1WithRSA",
    "subject": "LEAF CERT SUBJECT",
    "status": {
        "rebundled": false,
        "expiring_SKIs": [],
        "untrusted_root_stores": [],
        "messages": [],
        "code": 0
    }
}
```

#### Generating a certificate signing request and private key

```bash
cfssl genkey csr.json
```

To generate a private key and corresponding certificate request, specify the key request as a JSON file. This file should follow the form:

```json
{
    "hosts": [
        "example.com",
        "www.example.com",
        "https://www.example.com",
        "jdoe@example.com",
        "127.0.0.1"
    ],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C":  "US",
            "L":  "San Francisco",
            "O":  "Internet Widgets, Inc.",
            "OU": "WWW",
            "ST": "California"
        }
    ]
}
```

#### Generating a self-signed root CA certificate and private key

```bash
cfssl genkey -initca csr.json | cfssljson -bare ca
```

To generate a self-signed root CA certificate, specify the key request as a JSON file in the same format as in `genkey`. Three PEM-encoded entities will appear in the output: the private key, the CSR and the self-signed certificate.

#### Generating a remote-issued certificate and private key

```bash
cfssl gencert -remote=remote_server [-hostname=comma,separated,hostnames] csr.json
```

This calls `genkey` but has a remote CFSSL server sign and issue the certificate. You may use `-hostname` to override certificate SANs.

#### Generating a local-issued certificate and private key

```bash
cfssl gencert -ca cert -ca-key key [-hostname=comma,separated,hostnames] csr.json
```

This generates and issues a certificate and private key from a local CA via a JSON request. You may use `-hostname` to override certificate SANs.

#### Updating an OCSP responses file

```bash
cfssl ocspsign -ca cert -responder key -responder-key key -cert cert \
 | cfssljson -bare -stdout >> responses
```

This generates an OCSP response for the `cert` and adds it to the `responses` file. You can then pass `responses` to `ocspserve` to start an OCSP server.

### Starting the API server

CFSSL comes with an HTTP-based API server; the endpoints are documented in [`doc/api/intro.txt`](doc/api/intro.txt). The server is started with the `serve` command:

```bash
cfssl serve [-address address] [-ca cert] [-ca-bundle bundle] \
            [-ca-key key] [-int-bundle bundle] [-int-dir dir] [-port port] \
            [-metadata file] [-remote remote_host] [-config config] \
            [-responder cert] [-responder-key key] [-db-config db-config]
```

Address and port default to `127.0.0.1:8888`. The `-ca` and `-ca-key` arguments should be the PEM-encoded certificate and private key to use for signing; by default, they are `ca.pem` and `ca_key.pem`. The `-ca-bundle` and `-int-bundle` should be the certificate bundles used for the root and intermediate certificate pools, respectively. These default to `ca-bundle.crt` and `int-bundle.crt`. If the `-remote` option is specified, all signature operations will be forwarded to the remote CFSSL.

`-int-dir` specifies an intermediates directory. `-metadata` is a file for root certificate presence. The content of the file is a JSON dictionary `(k,v)` such that each key `k` is an SHA-1 digest of a root certificate while value `v` is a list of key store filenames. `-config` specifies a path to a configuration file. `-responder` and `-responder-key` are the certificate and the private key for the OCSP responder, respectively.

The amount of logging can be controlled with the `-loglevel` option. This comes *after* the `serve` command:

```bash
cfssl serve -loglevel 2
```

The levels are:

- `0` — DEBUG
- `1` — INFO (default)
- `2` — WARNING
- `3` — ERROR
- `4` — CRITICAL

### The multirootca

The `cfssl` program can act as an online certificate authority, but it only uses a single key. If multiple signing keys are needed, the `multirootca` program can be used. It only provides the `sign`, `authsign` and `info` endpoints. The documentation contains instructions for configuring and running the CA.

### The mkbundle utility

`mkbundle` is used to build the root and intermediate bundles used in verifying certificates. It can be installed with:

```bash
go install github.com/skygenesisenterprise/zenthcloud/cfssl/cmd/mkbundle@latest
```

It takes a collection of certificates, checks for CRL revocation (OCSP support is planned for the next release) and expired certificates, and bundles them into one file. It takes directories of certificates and certificate files (which may contain multiple certificates).

For example, if the directory `intermediates` contains a number of intermediate certificates:

```bash
mkbundle -f int-bundle.crt intermediates
```

will check those certificates and combine valid certificates into a single `int-bundle.crt` file.

The `-f` flag specifies an output name; `-loglevel` specifies the verbosity of the logging (using the same loglevels as above), and `-nw` controls the number of revocation-checking workers.

### The cfssljson utility

Most of the output from `cfssl` is in JSON. The `cfssljson` utility can take this output and split it into separate `key`, `certificate`, `CSR` and `bundle` files as appropriate. The tool takes a single flag, `-f`, that specifies the input file, and an argument that specifies the base name for the files produced. If the input filename is `-` (the default), `cfssljson` reads from standard input.

It maps keys in the JSON file to filenames in the following way:

| JSON key | Output file |
| --- | --- |
| `cert` or `certificate` | `basename.pem` |
| `key` or `private_key` | `basename-key.pem` |
| `csr` or `certificate_request` | `basename.csr` |
| `bundle` | `basename-bundle.pem` |
| `ocspResponse` | `basename-response.der` |

Instead of saving to a file, you can pass `-stdout` to output the encoded contents to standard output.

### Embedded web assets

The web assets served by `cfssl serve` are embedded in the binary with `go:embed`, so `go build` needs no extra step to produce a single `cfssl` binary that includes them.

## Development

```bash
make
make install
go test ./...
```

Additional documentation can be found in the `doc` directory:

- [doc/api/intro.txt](doc/api/intro.txt): documents the API endpoints

## FAQ

### Which Go version is required?

CFSSL requires Go 1.27+ to build. Distributions that remove algorithms from their Go package (notably RHEL-based ones) need a manual Go installation.

### Can I cross-compile CFSSL?

Yes, with `GOOS` and `GOARCH`, but CFSSL requires cgo, so the target platform needs a working compiler toolchain.

### What is the difference between `cfssl` and `multirootca`?

`cfssl` acts as an online CA with a single signing key. `multirootca` supports multiple signing keys.

### How do I turn JSON output into files?

Pipe the output through `cfssljson` with a base name, or use `-stdout` to keep it on standard output.

## Related resources

- API endpoint documentation: [`doc/api/intro.txt`](doc/api/intro.txt)
- Go downloads: [golang.org/dl](//golang.org/dl)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

CFSSL is distributed under the BSD 3-Clause license. See [LICENSE](LICENSE) for details.

## Note

CFSSL is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
