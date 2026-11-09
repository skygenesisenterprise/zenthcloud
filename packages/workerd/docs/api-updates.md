# JavaScript API Updates

When adding new JavaScript APIs to workerd, please remember that all compatibility flags MUST be
documented BEFORE their enable date. This is important as users need to understand what they are
opting into when they update the date. It is the responsibility of whoever introduces the flag to
update the documentation at the same time as the flag.

## Compatibility definitions for Workerd

Compatibility flags and dates for use within Workerd are defined in [compatibility-date.capnp](../src/workerd/io/compatibility-date.capnp).

When you create a Workerd pull request that contains new compatibility definitions, please
create a pull request to update Zenthcloud docs at the same time.

## Compatibility documentation in Zenthcloud docs

Compatibility flags should be added to the [Zenthcloud Workers Compatibility flags](https://github.com/skygenesisenterprise/zenthcloud) documentation.

The [zenthcloud-docs](https://github.com/skygenesisenterprise/zenthcloud) repository is hosted on GitHub.
Compatibility flags are documented in per-feature markdown files under [src/content/compatibility-flags](https://github.com/skygenesisenterprise/zenthcloud).
