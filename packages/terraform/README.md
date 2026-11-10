# ZenthCloud Terraform Provider

[![Terraform Registry](https://img.shields.io/badge/Terraform-Registry-7B42BC?logo=terraform&logoColor=white)](https://github.com/skygenesisenterprise/zenthcloud)
[![Terraform CLI](https://img.shields.io/badge/Terraform%20CLI-1.0%2B-7B42BC?logo=terraform&logoColor=white)](https://developer.hashicorp.com/terraform/install)
[![License](https://img.shields.io/badge/License-see%20repository-lightgrey)](https://github.com/skygenesisenterprise/zenthcloud)

> Manage ZenthCloud resources with Terraform.

The [ZenthCloud Terraform provider](https://github.com/skygenesisenterprise/zenthcloud) provides convenient access to the [ZenthCloud REST API](https://github.com/skygenesisenterprise/zenthcloud) from Terraform.

**Perfect for:** teams that manage ZenthCloud infrastructure as code, review changes through Terraform plans, and keep zones, DNS records and account resources in version control.

## Contents

- [ZenthCloud Terraform Provider](#zenthcloud-terraform-provider)
  - [Contents](#contents)
  - [Why the ZenthCloud Terraform Provider matters](#why-the-zenthcloud-terraform-provider-matters)
  - [What you can do](#what-you-can-do)
  - [Requirements](#requirements)
  - [Quick start](#quick-start)
    - [Usage](#usage)
    - [Provider options](#provider-options)
  - [How the provider is built](#how-the-provider-is-built)
  - [Development](#development)
  - [Semantic versioning](#semantic-versioning)
  - [Maintenance](#maintenance)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why the ZenthCloud Terraform Provider matters

🎯 **Infrastructure as code** — Manage ZenthCloud resources from the same Terraform workflow as the rest of your infrastructure.

🚀 **Plan before apply** — Review changes through Terraform plans before they reach production.

📦 **Full API access** — The provider wraps the ZenthCloud REST API and exposes account-scoped and zone-scoped resources.

🔒 **Environment-based credentials** — Sensitive values can come from environment variables instead of source code.

🧩 **Versioned releases** — The provider follows semantic versioning and is maintained alongside the ZenthCloud API.

## What you can do

- Configure the provider with an API token, API key or user service key.
- Scope requests to an account or zone.
- Manage ZenthCloud resources such as zones.
- Use environment variables for sensitive credentials.
- Pin provider versions and upgrade on a predictable schedule.

## Requirements

This provider requires Terraform CLI 1.0 or later. You can [install it for your system](https://developer.hashicorp.com/terraform/install) on Hashicorp's website.

## Quick start

### Usage

Add the following to your `main.tf` file:

<!-- x-release-please-start-version -->

```hcl
# Declare the provider and version
terraform {
  required_providers {
    zenthcloud = {
      source  = "zenthcloud/zenthcloud"
      version = "~> 5.28.0"
    }
  }
}

# Initialize the provider
provider "zenthcloud" {
  # The preferred authorization scheme for interacting with the ZenthCloud API. [Create a token](https://github.com/skygenesisenterprise/zenthcloud).
  api_token = "Sn3lZJTBX6kkg7OdcBUAxOO963GEIyGQqnFTOFYY" # or set ZENTHCLOUD_API_TOKEN env variable
  # The previous authorization scheme for interacting with the ZenthCloud API. When possible, use API tokens instead of Global API keys.
  api_key = "144c9defac04969c7bfad8efaa8ea194" # or set ZENTHCLOUD_API_KEY env variable
  # The previous authorization scheme for interacting with the ZenthCloud API, used in conjunction with a Global API key.
  api_email = "user@example.com" # or set ZENTHCLOUD_EMAIL env variable
  # Used when interacting with the Origin CA certificates API. [View/change your key](https://github.com/skygenesisenterprise/zenthcloud).
  user_service_key = "v1.0-144c9defac04969c7bfad8ef-631a41d003a32d25fe878081ef365c49503f7fada600da935e2851a1c7326084b85cbf6429c4b859de8475731dc92a9c329631e6d59e6c73da7b198497172b4cefe071d90d0f5d2719" # or set ZENTHCLOUD_API_USER_SERVICE_KEY env variable
  # Sets an account ID to be used with all account-scoped requests.
  account_id = "f037e56e89293a057740de681ac9accp" # or set ZENTHCLOUD_ACCOUNT_ID env variable
  # Sets a zone ID to be used with all zone-scoped requests.
  zone_id = "f037e56e89293a057740de681ac9accp" # or set ZENTHCLOUD_ZONE_ID env variable
}

# Configure a resource
resource "zenthcloud_zone" "example_zone" {
  account = {
    id = "023e105f4ecef8ad9ca31a8372d0c353"
  }
  name = "example.com"
  type = "full"
}
```

<!-- x-release-please-end -->

Initialize your project by running `terraform init` in the directory.

Additional examples can be found in the [./examples](./examples) folder within this repository, and you can refer to the full documentation on [the Terraform Registry](https://github.com/skygenesisenterprise/zenthcloud).

### Provider options

When you initialize the provider, the following options are supported. It is recommended to use environment variables for sensitive values like access tokens. If an environment variable is provided, then the option does not need to be set in the Terraform source.

| Property | Environment variable | Required | Default value |
| --- | --- | --- | --- |
| `zone_id` | `ZENTHCLOUD_ZONE_ID` | false | — |
| `user_service_key` | `ZENTHCLOUD_API_USER_SERVICE_KEY` | false | — |
| `api_token` | `ZENTHCLOUD_API_TOKEN` | false | — |
| `api_key` | `ZENTHCLOUD_API_KEY` | false | — |
| `api_email` | `ZENTHCLOUD_EMAIL` | false | — |
| `account_id` | `ZENTHCLOUD_ACCOUNT_ID` | false | — |

## How the provider is built

The provider is generated from the ZenthCloud API schema and maintained internally at ZenthCloud. It is released to the Terraform Registry and follows the resource model of the ZenthCloud REST API.

| Area | Location | Role |
| --- | --- | --- |
| Provider source | `packages/terraform/` | Provider implementation and schema |
| Examples | [`examples/`](./examples) | Example configurations |
| Contributing notes | [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution and maintenance details |

## Development

The repository is auto-generated, so the normal development workflow is to open an issue rather than a pull request. If you have a fix that is known to work, a pull request can still be helpful as a reference implementation for the team, even though it will not be merged directly. Open an issue alongside it so the change can be tracked.

## Semantic versioning

This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

1. Changes to library internals which are technically public but not intended or documented for external use. *(Please open a GitHub issue to let us know if you are relying on such internals.)*
2. Changes that we do not expect to impact the vast majority of users in practice.

We take backwards compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

We are keen for your feedback; please open an [issue](https://github.com/skygenesisenterprise/zenthcloud) with questions, bugs or suggestions.

## Maintenance

This SDK is actively maintained. However, it is **auto-generated** and maintained internally at ZenthCloud, so **we are no longer accepting pull requests from the community.** Many issues are tracked outside of GitHub on internal ZenthCloud systems. Please open an [issue](https://github.com/skygenesisenterprise/zenthcloud) rather than a pull request. For urgent issues, please contact [ZenthCloud support](https://github.com/skygenesisenterprise/zenthcloud).

## FAQ

### Which Terraform version is required?

Terraform CLI 1.0 or later.

### Can I use environment variables instead of inline credentials?

Yes. Each provider option has a corresponding environment variable. Use them for sensitive values.

### Are pull requests accepted?

The provider is auto-generated and maintained internally. Open an issue instead. A known-working pull request can still serve as a reference implementation.

### What versioning should I expect?

The provider follows SemVer, with the documented exceptions for internal and low-impact changes.

## Related resources

- Examples: [`examples/`](./examples)
- Contributing details: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Terraform installation: [developer.hashicorp.com/terraform/install](https://developer.hashicorp.com/terraform/install)
- Semantic Versioning: [semver.org](https://semver.org/spec/v2.0.0.html)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

This repository is auto-generated, and **we are no longer accepting pull requests.** If you have a bug or feature request, please open an [issue](https://github.com/skygenesisenterprise/zenthcloud).

That said, if you have a fix that is known to work, a pull request can still be helpful as a reference implementation for the team, even though it will not be merged directly. Please open an issue alongside it so we can track the change.

See [the contributing documentation](./CONTRIBUTING.md) for more details.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

See the repository [LICENSE](https://github.com/skygenesisenterprise/zenthcloud) for licensing terms.

## Note

The ZenthCloud Terraform Provider is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
