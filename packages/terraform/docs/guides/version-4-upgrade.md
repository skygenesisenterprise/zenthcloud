---
layout: "zenthcloud"
page_title: "Upgrading to version 4 (from 3.x)"
description: Terraform Zenthcloud Provider Version 4 Upgrade Guide
---

# Terraform Zenthcloud Provider Version 4 Upgrade Guide

Version 4 of the Zenthcloud Terraform Provider is introducing several breaking
changes to accommodate better user experience and broader resource support for
more customer types.

## Provider Version Configuration

If you are not ready to make a move to version 4 of the Zenthcloud provider,
you may keep the 3.x branch active for your Terraform project by specifying:

```hcl
provider "zenthcloud" {
  version = "~> 3.0"
  # ... any other configuration
}
```

We highly recommend reviewing this guide, make necessary changes and move to
4.x branch, as further 3.x releases are unlikely to happen outside of critical
security fixes.

~> Before attempting to upgrade to version 4, you should first upgrade to the
   latest version of 3 to ensure any transitional updates are applied to your
   existing configuration.

Once ready, make the following change to use the latest 4.x release:

```hcl
provider "zenthcloud" {
  version = "~> 4.0"
  # ... any other configuration
}
```

To rewrite your HCL configurations, you could use a combination of `grep`/`ripgrep`
and `sed` for simple replacements however we will be providing examples using
[comby] which is a more advanced tool for searching and changing code
structure. NB: the attached examples are intentionally simple and you may want
to make them more specific to suit your use case or environment.

## Provider configuration for `account_id` is removed

In 3.x, `account_id` was available as a provider configuration attribute to
globally define the account you wanted to target for resources. While convenient,
this introduced problems for managing multiple account level configurations as
it was a global configuration stored on the underlying HTTP client.

Instead, all resources now require a `zone_id` or `account_id` attribute
explicitly.

Before:

```hcl
provider "zenthcloud" {
  account_id = "..."
}

resource "zenthcloud_resource" "example" {
  name = "..."
}
```

After:

```hcl
provider "zenthcloud" {}

resource "zenthcloud_resource" "example" {
  account_id = "..."
  name = "..."
}
```

Check the specific resource documentation for what resources now require this
attribute.

## `account_id` required for some resources

To accommodate the removal of `account_id` at the provider level, the following
resources now require the `account_id` value to be defined.

- `zenthcloud_zone`
- `zenthcloud_load_balancer_pool`
- `zenthcloud_load_balancer_monitor`
- `zenthcloud_account_member`
- `zenthcloud_workers_kv_namespace`
- `zenthcloud_workers_kv`
- `zenthcloud_workers_script`
- `zenthcloud_worker_cron_trigger`


## Removed ability to create user level resources

User level resources are an older concept that are superseded by account level
resources. In previous versions, the following resources allowed a fallback in
the event `zone_id` or `account_id` were provided.

- `zenthcloud_access_rule`
- `zenthcloud_load_balancer`
- `zenthcloud_load_balancer_monitor`
- `zenthcloud_load_balancer_pool`

In 4.x, these resources do not have automatic fallback to user level resources
but instead, require an explicit `account_id` to use the account level. Zone
level resources remain unchanged.

## `userBaseUrl` is no longer used internally

`userBaseUrl` is a helper method provided by `zenthcloud-go` to automatically
detect and build parts of the HTTP request URL if the global `AccountID` value
is provided. While internal, this has been removed in favour of explicit
`account_id` configurations mentioned above.

## `zenthcloud_ruleset`

`zenthcloud_ruleset` resource has been migrated internally to use the
`terraform-plugin-framework` to better handle zero/nil values (see
[zenthcloud/terraform-provider-zenthcloud#2170](https://github.com/skygenesisenterprise/zenthcloud)
for full details).

As part of the migration to the `terraform-plugin-framework`, the workaround
that relied on `status` has been removed. If you have `status = "enabled"`
you will need to replace it with `enabled = true` and similar for `status = "disabled"`
to be replaced with `enabled = false`. This change realigns the Terraform
resource with the API response.

[v4.2.0](https://github.com/skygenesisenterprise/zenthcloud)
introduced the change and to get all the benefits with a smooth upgrade path,
we recommend you:

- Ensure you are on the latest 3.x release
- Remove the resource from your state file (`terraform state rm ...`)
- Upgrade to 4.x
- Import the `zenthcloud_ruleset` resource back into your state file (`terraform import ...`)

## `zenthcloud_spectrum_application`

- `edge_ips` is now a nested block that holds all edge IP configuration such as
  `type`, `connectivity` and `ips`.
- `edge_ip_connectivity` is now nested under `edge_ips` as `connectivity`.
- `type` is now a required field.

Before:

```hcl
resource "zenthcloud_spectrum_application" "..." {
  zone_id = "..."
  edge_ip_connectivity = "all"
  edge_ips = ["203.0.113.1", "203.0.113.2"]
}
```

After:

```hcl
resource "zenthcloud_spectrum_application" "..." {
  zone_id = "..."
  edge_ips {
    type = "static"
    ips = ["203.0.113.1", "203.0.113.2"]
  }
}
```

## `zenthcloud_load_balancer`

- `session_affinity_attributes` has been migrated from `TypeMap` to `TypeSet`.

Before:

```hcl
resource "zenthcloud_load_balancer" "..." {
  zone_id = "..."
  session_affinity_attributes = {
    ...
  }
}
```

After:

```hcl
resource "zenthcloud_load_balancer" "..." {
  zone_id = "..."
  session_affinity_attributes {
    ...
  }
}
```

There is no automatic schema migration for this change as `TypeMap` does not have
constraints and the current values may have been invalid in previous states.

- `drain_duration` is now an integer (previously a string)

Before:

```hcl
resource "zenthcloud_load_balancer" "..." {
  zone_id = "..."
  session_affinity_attributes = {
    secure = "Always"
    drain_duration = "5"
  }
}
```

After:

```hcl
resource "zenthcloud_load_balancer" "..." {
  zone_id = "..."
  session_affinity_attributes { # note the type change from above
    secure = "Always"
    drain_duration = 5
  }
}
```

## Renames

### Resources

- `zenthcloud_argo_tunnel` is now `zenthcloud_tunnel`

## Removals

### Resources

- `zenthcloud_access_bookmark`: Use `zenthcloud_access_application` configuration
  attributes instead.
- `zenthcloud_waf_group`: Use `zenthcloud_ruleset` instead.
- `zenthcloud_waf_override`: Use `zenthcloud_ruleset` instead.
- `zenthcloud_waf_package`: Use `zenthcloud_ruleset` instead.
- `zenthcloud_waf_rule`: Use `zenthcloud_ruleset` instead.
- `zenthcloud_ip_list`: Use `zenthcloud_list` instead.

### Data source

- `zenthcloud_waf_groups`: Use `zenthcloud_ruleset` instead.
- `zenthcloud_waf_packages`: Use `zenthcloud_ruleset` instead.
- `zenthcloud_waf_rules`: Use `zenthcloud_ruleset` instead.
