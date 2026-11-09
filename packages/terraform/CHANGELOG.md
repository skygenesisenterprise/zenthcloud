# Changelog

## 5.28.1 (2026-10-20)

Full Changelog: [v5.28.0...v5.28.1](https://github.com/skygenesisenterprise/zenthcloud)

### Changes

- the provider is now built with Go 1.27.3, which distrusts a set of intermediate certificate authorities that have been revoked for CA compromise. The distrust list is compiled into the provider binary, so affected chains are rejected regardless of the host's system trust store. Upgrade to this release to pick up the change; no configuration changes are required.
- **zenthcloud-go**: the Go SDK dependency is updated to v7.13.1.
- **zenthcloud-go**: the unused v6 Go SDK dependency is removed. The `api_shield_discovery_operation` list data source now uses v7.

## 5.28.0 (2026-10-12)

Full Changelog: [v5.27.0...v5.28.0](https://github.com/skygenesisenterprise/zenthcloud)

### ⚠ BREAKING CHANGES

- **api_shield_discovery_operation**: `operation_id` has been renamed to `discovery_id`, `zone_id` is now required, and the computed `id` attribute has been removed. Update resource arguments and any expressions referencing `id`. This resource remains deprecated and cannot be imported. No new state upgrader is included for these schema changes.
- **email_security_trusted_domains**: `is_recent`, `is_regex`, and `is_similarity` are now required instead of optional. Set all three explicitly, using `false` for protections that should not be bypassed.
- **registrar_domain, registrar_domains**: the `zenthcloud_registrar_domain` resource and data source, and the `zenthcloud_registrar_domains` list data source, have been removed. Configurations using these types must be updated before upgrading; this release does not provide a replacement Terraform resource or data source.
- **zero_trust_dlp_custom_entry, zero_trust_dlp_entry, zero_trust_dlp_integration_entry, zero_trust_dlp_predefined_entry**: the computed `word_list` attribute is now a list of strings instead of a JSON-encoded string, on resources and their data sources. The same change applies to nested `word_list` values in the `zero_trust_dlp_custom_profile` and `zero_trust_dlp_predefined_profile` data sources. Remove `jsondecode(...)` around these values and update expressions expecting a string. No new state upgrader is included for this type change.
- **zero_trust_organization**: `mfa_ssh_piv_key_requirements` has been replaced with `mfa_piv_key_requirements` on the resource and data source, restoring the field name accepted by the API. Rename the argument and any references to it; the nested attributes are unchanged. No new state upgrader is included for this rename. This also restores API serialization and empty-list normalization, so PIV requirements use the correct API field name and empty SSH key lists do not cause perpetual diffs.

### Notes

- **pages_project**: the API documentation now clarifies that build image version 1 is retired and affected projects are moved to version 3. Once a project's builds have moved, requests setting `deployment_configs.preview.build_image_major_version` or `deployment_configs.production.build_image_major_version` to 1 are rejected. Use version 3 for those projects.
- **zero_trust_device_custom_profile**: the read-only `target_tests` attribute is deprecated on the resource and its data sources.
- **zero_trust_dlp_custom_entry, zero_trust_dlp_entry, zero_trust_dlp_integration_entry, zero_trust_dlp_predefined_entry**: the computed `deprecated` attribute no longer defaults to `false`.

### Features

#### New Resources

- **zenthcloud_monetization_rules**: manage a zone's Payment Required ruleset, including `exact`, `upto`, and `origin_controlled` payment schemes. Supports `terraform import` using the zone ID.

#### New Data Sources

- **zenthcloud_monetization_rules**: read a zone's Payment Required ruleset.

#### New Attributes

- **ai_search_instance, ai_search_instances**: `metadata.created_from_emdash_plugin`, with `type` (`native` or `rest`) and `version`.
- **pages_project, pages_projects**: read-only `build_image_auto_upgrade.from_version` and `build_image_auto_upgrade.to_version`, identifying projects moved from a retired build image.
- **worker_version, worker_versions, workers_script**: Durable Object binding retry settings, `bindings.retry.max_attempts` and `bindings.retry.timeout_ms`. `max_attempts` counts retries after the initial request and accepts 0–10; zero disables retries. `timeout_ms` accepts 500–60000 and controls the retry window, not the initial-request timeout.
- **workers_kv_namespace, workers_kv_namespaces**: `mode`; set `mode = "instant"` when creating a namespace to use KV Instant, or omit it for a classic namespace. Changing the resource's mode forces replacement.
- **workers_script**: `bindings_inherit = "strict"` makes uploads fail when an inherited binding cannot be resolved, instead of silently dropping that binding.
- **zero_trust_access_application, zero_trust_access_applications**: `target_criteria.include`, `target_criteria.require`, and `target_criteria.exclude`, supporting hostname and tag selectors for infrastructure targets. The rule format requires `include`; `require` and `exclude` are optional. Each rule must contain a hostname selector or tags, with selector sizes and empty values validated at plan time. The legacy `target_criteria.target_attributes` format remains supported for unchanged persisted maps, including non-hostname keys. For new or changed criteria, prefer the rule format. The legacy format and rule format cannot be combined in the same criterion.
- **zero_trust_access_identity_provider, zero_trust_access_identity_providers**: `config.login_page_auto_prompt`, defaulting to `false` on the resource, to automatically prompt for passkey authentication on the Access login page.
- **zero_trust_gateway_certificate, zero_trust_gateway_certificates**: read-only `region`, identifying where the certificate authority's key material is pinned.
- **zero_trust_resource_library_application, zero_trust_resource_library_applications**: `lookup` query support for finding complete application name mentions in a phrase. Use `filter.lookup` on the singular data source or `lookup` on the list data source. It cannot be combined with `search`.

#### New Accepted Values

- **zero_trust_access_application**: `session_duration` is now supported for infrastructure applications and defaults to `24h`, fixing creation failures when the API returns this default. It sets the maximum connection duration and must use `s`, `m`, or `h` in whole seconds.
- **zero_trust_access_identity_provider**: `type` accepts `passkeys`.
- **zero_trust_device_custom_profile**: `match` expressions support `device.tags`.

### Bug Fixes

- **d1_database**: make `read_replication` optional and computed with a nested custom type, allowing API-returned replication settings to populate state when the block is omitted.
- **dns_record**: default missing `include_shadow_metadata` to `false` during refresh and v4 to v5 migration, avoiding spurious updates for older state. Allow `modified_on` to change when `private_routing` or `include_shadow_metadata` changes, preventing inconsistent-result errors after updates.
- **hostname_tls_setting**: populate the required `setting_id` during import, so imported hostname TLS settings can be refreshed and managed.
- **pages_domain, r2_data_catalog, stream_caption_language, stream_download, stream_key, zero_trust_access_short_lived_certificate**: stop sending JSON request bodies to API operations that do not accept a body.
- **pages_project, workers_kv_namespace, workers_script, zero_trust_access_application, zero_trust_access_identity_provider, zero_trust_gateway_certificate**: add newly introduced attributes to the v500 migration target models so existing state upgraders match the current schemas.
- **ruleset**: improve legacy v4 state detection and migration at schema versions 0 and 1, including nested blocks, retired metadata, and v4.52.9 `content_converter` fields. Preserve configured `content_converter` values and existing v5 state, including rules managed with `lifecycle.ignore_changes`.
- **worker**: preserve changes made only to `previews_base_config`, including configuration-derived unknown values, so preview-only updates do not incorrectly retain the previous `updated_on` value or suppress the planned change.
- **workers_script**: prefer the API's `CF-Entrypoint` header when refreshing multipart script content, allowing renamed entrypoints to surface as drift instead of failing to find a stale module name. Preserve service-worker `body_part` format during refresh.
- **zero_trust_access_application**: clear prior target criteria before decoding refresh responses, so removed rules and selectors become null instead of retaining stale objects in state.

## 5.27.0 (2026-10-03)

Full Changelog: [v5.26.0...v5.27.0](https://github.com/skygenesisenterprise/zenthcloud)

### ⚠ BREAKING CHANGES

One change requires a configuration edit. The rest of this release's schema movement is read-only reshaping with no action required — see [Schema Changes](#schema-changes-no-action-required) at the end.

- **api_shield_operation**: the `feature` and `with_schemas` attributes have been removed from the resource. They were never resource state — both are read-shaping query parameters on the list/get endpoints, and there is no create or update endpoint that accepts them. Remove them from any `zenthcloud_api_shield_operation` block; leaving them in place produces an "Unsupported argument" error. The schema version moves from 500 to 501 and an automatic state upgrader strips both fields from existing state, so no manual state editing is required. This also fixes the `.with_schemas: was cty.False, but now null` error raised when upgrading from v5.26.0.

### Notes

- **magic_transit_site**: changing `ha_mode` no longer forces replacement. The upstream API added update support, so the site is modified in place.
- **magic_transit_site_lan**: changing `ha_link` no longer forces replacement, for the same reason.
- **magic_transit_site_wan**: `health_check_rate` is now configurable (previously read-only).
- **ai_search_instance**: `hybrid_search_enabled` now reflects the API default of `true` for newly created instances. Existing instances keep the value already in state, so upgrading does not plan a change.
- **zone_dns_settings**: `nameservers.ns_set` is now computed. It applies only to custom nameserver types and is preserved from state when the API does not return it.
- **zone_dns_settings**: `foundation_dns` is deprecated and will be removed in a future API version. Set `nameservers.type` to `zenthcloud.advanced` to turn Advanced Nameservers on, or `zenthcloud.standard` to turn it off.
- **ai_gateway**: the default for `spend_limits.rules.id` changed from `865b4d33` to `00000000`. Configurations that do not set `id` explicitly will show a one-time diff on the next plan.
- **zero_trust_device_custom_profile**: changing an explicitly configured `profile_type` now forces replacement. The field is set when the profile is created and cannot be changed, so an in-place update was never possible. Configurations that omit `profile_type` are unaffected.

### Features

#### New Resources

- **zenthcloud_zero_trust_casb_integration**: Zero Trust CASB Integration

#### New Data Sources

- **zenthcloud_zero_trust_casb_integration**: Zero Trust CASB Integration
- **zenthcloud_zero_trust_casb_integrations**: Zero Trust CASB Integrations (list)

#### New Attributes

- **magic_transit_site_wan**: `load_balance_inner_flows`
- **zero_trust_organization**: `strict_service_token_auth`
- **zone_dns_settings**: `nameservers.nameserver_set_id`
- **ai_search_instance, ai_search_instances**: `hostname` filter
- **account_api_token_permission_groups, account_api_token_permission_groups_list, api_token_permission_groups_list**: `category` and `is_selectable`

#### New Accepted Values

- **flagship_flag**: `rules.conditions[...].operator` accepts `has` and `not_has`
- **pipeline_sink**: `type` accepts `basin_catalog`
- **worker_version**: `bindings.type` accepts `artifacts`
- **workers_script**: `bindings.type` accepts `artifacts`, `flagship`, `k2` and `messaging`
- **zone_dns_settings**: `nameservers.type` accepts `zenthcloud.advanced` and `custom`

#### Other

- bump zenthcloud-go to v7.12.0
- **calls_turn_app**: add support for `terraform import`
- **zero_trust_casb_policy**: reject at plan time configurations where `applies_to_all_integrations` is `false` and no integration IDs resolve. Existing policies that omit `integration_ids` and retain IDs in state continue to plan normally.

### Bug Fixes

- **api_shield**: add missing `normalize` field to v500 migration target model
- **bot_management**: wire up AI Crawl Control fields in hand-maintained API plumbing
- **bot_management**: wire `ai_bots_migration_opt_out` into the API model
- **calls_turn_app**: populate `key_id` from the API's `uid` after create, so plan, refresh, update and destroy no longer fail with "missing required key_id parameter"
- **d1_database**: add missing fields to the v500 migration target model
- **dns_record**: default `include_shadow_metadata` to false on import
- **logpush_dataset_field**: deserialize the `fields` result map
- **logpush_job**: add `decode_null_to_zero` to `filter_attack_traffic`
- **notification_policy**: add missing `token_id` to the v500 migration target model
- **observatory_scheduled_test**: require replacement when `frequency` or `region` change, as the API has no update endpoint for scheduled tests
- **page_rule**: send the API's `query_string` wildcard
- **schema_validation_schemas**: default `omit_source` to false on import
- **snippet_rules**: remove stale and spurious top-level fields from the migration target model
- **turnstile_widget**: default `page`/`per_page` to their spec values on import
- **worker**: remove `observability.redact_query_string`
- **worker, worker_version**: backfill author fields on create
- **worker_version**: exclude `exports_reconciliation` from the v0 legacy schema
- **worker_version**: add missing V0 fields to fix a migration test panic
- **workers_kv**: add missing `expiration`/`expiration_ttl` to the v500 migration target model
- **workers_script**: add missing `base_path` and `observability.issues` attributes
- **workers_script**: add missing `stream` attribute to the bindings schema
- **workers_script**: add missing `force` field to the legacy V0 migration struct
- **zero_trust_access_ai_controls_mcp_server**: only send changed fields on update, so unrelated changes no longer resend and rotate `client_secret`; redact `auth_credentials` and `client_secret` from debug logs
- **zero_trust_access_mtls_hostname_settings**: import now takes an explicit `accounts/<account_id>` or `zones/<zone_id>` prefix. Account and zone IDs are both 32-character hex, so the previous length-based detection always resolved to account scope and zone-scoped resources could not be imported.
- **zero_trust_device_custom_profile**: stop split tunnel entries inheriting a mutually exclusive field from state, which caused "host and Address both cannot be present" API errors
- **zero_trust_organization**: add `warp_auth_non_browser_401` to the v4 source model, unblocking v4 to v5 migration
- **zero_trust_organization**: ignore `mfa_configuration_allowed`/`service_token_inactivity` on import
- **zero_trust_organization**: normalize `mfa_configuration_allowed`, `service_token_inactivity`, `trusted_accounts`
- **zero_trust_organization**: fix refresh-plan instability for 4 attributes
- **zero_trust_tunnel_warp_connector**: restore `ha` from `metadata.ha` on import and read

### Schema Changes (no action required)

Upstream Zenthcloud API schema changes picked up via the zenthcloud-go v7.12.0 bump. These are listed for completeness; none require a change to a working configuration.

Of the 54 removed attributes, 52 are read-only (computed): existing state files load without user action and plans are unaffected, so only configurations that *reference* them — in an `output` block or an expression — need updating. The two attributes that become `Required` were already mandatory server-side, so a request omitting them was always rejected; the failure simply moves from apply time to plan time. The one type change is on data sources only, and HCL converts numeric strings automatically.

- **account_member, account_members, account_permission_group, account_permission_groups, account_token, account_tokens, api_token, api_tokens, user_group, user_groups**: the generic `policies.permission_groups.meta.key` / `.value` pair has been replaced with typed fields — `category`, `deprecated`, `description`, `editable`, `eol_at`, `label`, `scopes`, `visibility`. Expressions reading `meta.key`/`meta.value` must move to the named field.
- **hyperdrive_config, hyperdrive_configs**: `integration.integration` has been renamed to `integration.hyperdrive_config_provider`.
- **queue, queues, queue_consumer, queue_consumers**: the read-only `settings.email`, `settings.pagerduty` and `settings.webhooks` detail attributes are no longer surfaced on the `zenthcloud_queue` resource or the queue data sources. Relatedly, `notification` is no longer an accepted value for the read-only `consumers.type` attribute on those surfaces. Queue *configuration* is unaffected — the `zenthcloud_queue_consumer` resource is unchanged and still accepts and manages all three settings blocks.
- **cloud_connector_rules**: `rules` is now `Required` instead of `Optional`. The API already rejects a request that omits it, so this moves the failure from apply time to plan time rather than breaking a working configuration.
- **zone_dns_settings**: `nameservers.type` is now `Required` instead of `Optional`. `nameservers` became a discriminated union upstream and `type` is its discriminator, so it was already mandatory in practice.
- **flagship_flag, flagship_flags**: `limit` changed from `String` to `Int64` and is now constrained to between 1 and 200. These are data sources only, so there is no state to migrate, and HCL converts numeric strings automatically — `limit = "10"` continues to work.

## 5.26.0 (2026-09-24)

Full Changelog: [v5.25.0...v5.26.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

#### New Resources

- **zenthcloud_field_extractor**: Field Extractor
- **zenthcloud_magic_wan_bgp_filter_profile**: Magic WAN BGP Filter Profile
- **zenthcloud_zero_trust_casb_policy**: Zero Trust CASB Policy
- **zenthcloud_zero_trust_casb_webhook**: Zero Trust CASB Webhook
- **zenthcloud_zero_trust_connectivity_settings**: Zero Trust Connectivity Settings
- **zenthcloud_zone_tracing**: Zone Tracing
- **zenthcloud_zone_tracing_rules**: Zone Tracing Rules

#### New Data Sources

- **zenthcloud_field_extractor**: Field Extractor
- **zenthcloud_magic_wan_bgp_filter_profile**: Magic WAN BGP Filter Profile
- **zenthcloud_magic_wan_bgp_filter_profiles**: Magic WAN BGP Filter Profiles (list)
- **zenthcloud_zero_trust_casb_policy**: Zero Trust CASB Policy
- **zenthcloud_zero_trust_casb_policies**: Zero Trust CASB Policies (list)
- **zenthcloud_zero_trust_casb_webhook**: Zero Trust CASB Webhook
- **zenthcloud_zero_trust_casb_webhooks**: Zero Trust CASB Webhooks (list)
- **zenthcloud_zero_trust_connectivity_settings**: Zero Trust Connectivity Settings
- **zenthcloud_zone_tracing**: Zone Tracing
- **zenthcloud_zone_tracing_rules**: Zone Tracing Rules

#### New Attributes

- zenthcloud_magic_wan_gre_tunnel, zenthcloud_magic_wan_ipsec_tunnel
  - **bgp.import_filter_id**: ID of the BGP filter profile applied to routes received from the customer
  - **bgp.export_filter_id**: ID of the BGP filter profile applied to routes advertised to the customer

### Bug Fixes

- **custom_ssl**: mark `private_key` optional to unblock setting `custom_csr_id`
- **email_routing_settings**: add missing `support_subaddress` to resource schema
- **load_balancer_monitor**: correctly resolve ambiguous version-zero state during v4 to v5 migration
- **page_rule**: raise `edge_cache_ttl` maximum to allow one-year values
- **provider**: send `user_agent_operator_suffix` unquoted and read fallback from environment variable
- **ruleset**: normalize legacy query string wildcards during v4 to v5 migration
- **zone_lockdown**: drop `UseNonNullStateForUnknown` on `created_on` to prevent perpetual diff


## 5.25.0 (2026-09-10)

Full Changelog: [v5.24.0...v5.25.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

#### New Resources

- **zenthcloud_email_security_allow_policy**: Cloud Email Security Allow Policy
- **zenthcloud_email_security_domain**: Cloud Email Security Domain
- **zenthcloud_email_sending_subdomain**: Email Sending Subdomain
- **zenthcloud_nel_setting**: Network Error Logging Zone Setting
- **zenthcloud_zero_trust_resource_library_application**: Zero Trust Resource Library Application

#### New Data Sources

- **zenthcloud_email_security_allow_policy**: Cloud Email Security Allow Policy
- **zenthcloud_email_security_allow_policies**: Cloud Email Security Allow Policies (list)
- **zenthcloud_email_security_domain**: Cloud Email Security Domain
- **zenthcloud_email_security_domains**: Cloud Email Security Domains (list)
- **zenthcloud_email_sending_subdomain**: Email Sending Subdomain
- **zenthcloud_email_sending_subdomains**: Email Sending Subdomains (list)
- **zenthcloud_nel_setting**: Network Error Logging Zone Setting
- **zenthcloud_spectrum_protocols**: Spectrum Protocols (list)

#### New Attributes

- zenthcloud_ai_search_instance
  - **aisearch_model**: Workers AI model for AI search queries
  - **embedding_model**: Model used to generate text embeddings
  - **reranking_model**: Model used to rerank search results
  - **rewrite_model**: Workers AI model for query rewriting
  - **summarization_model**: Model used to summarize search results
- zenthcloud_bot_management
  - **bot_preference_sync_enabled**: Sync bot preferences from AI Search, AI User, and AI Training zone settings
- zenthcloud_content_scanning_expression
  - **payload**: Custom content extraction expression to locate content objects in requests
- zenthcloud_email_routing_dns
  - **support_subaddress**: Whether plus-addressing is honored when matching routing rules
- zenthcloud_magic_transit_connector
  - **primary**: Whether this connector is the primary connector for the site
  - **site_id**: Identifier of the Magic Transit site this connector belongs to
- zenthcloud_oauth_client
  - **optional_scopes**: Scopes a user may decline during OAuth consent
- zenthcloud_organization
  - **account_creation_applies_tenant_defaults**: Whether tenant defaults apply to newly created accounts
- zenthcloud_pipeline_sink
  - **format**: Output data format configuration for the sink
  - **schema**: Schema definition for events in the data stream
- zenthcloud_pipeline_stream
  - **format**: Data format configuration for stream events
  - **schema**: Schema definition for events in the data stream
- zenthcloud_ruleset
  - **origin_range_requests**: Fetch large origin assets as a series of range requests
  - **vary**: Cache variation key configuration for set_cache_settings action
- zenthcloud_stream_live_input
  - **playback**: HLS and DASH manifest URLs for live stream playback
- zenthcloud_worker_version
  - **identity**: Enables Gateway identity for network bindings
- zenthcloud_workers_kv_namespace
  - **jurisdiction**: Restrict KV data storage to a specific jurisdiction at creation time
- zenthcloud_workers_script
  - **files**: Multipart WASM modules and binary files included in the Worker upload
- zenthcloud_workflow
  - **concurrency**: Concurrency limit and active instance count for the workflow
- zenthcloud_zero_trust_access_group
  - **account_id**: Account that owns the device posture integration (in posture sub-rules)
- zenthcloud_zero_trust_access_identity_provider
  - **force_authn**: Asks the IdP to reauthenticate on each SAML request
  - **max_sso_url_length**: Maximum URL length accepted for SSO redirect

### Bug Fixes

- **bot_management**: mark `bot_preference_sync_enabled` optional-only; `Computed` caused "unknown after apply" errors
- **custom_pages**: Update causing inconsistent apply results
- **email_routing_dns**: data source not returning any data ([#7130](https://github.com/skygenesisenterprise/zenthcloud))
- **email_security_block_sender**: mark `account_id` as required in data sources
- **image**: fix create/update marshaling errors
- **magic_transit_connector**: add missing `primary` and `site_id` fields; mark `account_id` as required in data sources
- **registrar_domain**: mark `account_id` as required in list data source
- **worker_version**: correct response binding order to prevent plan drift ([#7115](https://github.com/skygenesisenterprise/zenthcloud))
- set schema `Version: 500` on new resources to enable correct state upgrade path


## 5.24.0 (2026-08-20)

Full Changelog: [v5.23.0...v5.24.0](https://github.com/skygenesisenterprise/zenthcloud)

### BREAKING CHANGES

The following upstream API schema changes required corresponding provider schema updates. Existing state files load without user action (the plugin framework silently drops attributes that no longer exist in the schema), but Terraform **configurations** that still reference removed attributes must be updated before `terraform plan` will succeed.

* **hostname_tls_setting:** the `zenthcloud_hostname_tls_setting` data source now requires `hostname` as an input parameter instead of returning it as a computed attribute. The computed `id` attribute has been removed; use `setting_id` instead. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **image_variant:** the computed `variant` nested attribute has been removed. The API no longer returns this wrapper object; the `id`, `options`, and `never_require_signed_urls` fields remain available at the top level. Remove any references to `zenthcloud_image_variant.<name>.variant` from your configurations. ([738bd28](https://github.com/skygenesisenterprise/zenthcloud))
* **organization:** the computed `meta.flags` nested attribute has been renamed to `meta.tenant_flags`. Two new computed sub-attributes (`enterprise_capability`, `member_management`) have been added. Update any references from `.meta.flags` to `.meta.tenant_flags`. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_ai_controls_mcp_portal:** the `allow_code_mode` attribute is now deprecated and no longer computed with a default of `true`. Use the new `code_mode` attribute (`"off"`, `"opt_in"`, `"default_on"`, `"enforced"`) instead. Configurations that relied on the computed default must explicitly set `code_mode` or `allow_code_mode`. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** the `session_duration` attribute is no longer computed with a default of `"24h"`. It is now optional-only. Existing configurations that omitted `session_duration` and relied on the provider default will see a plan diff; explicitly set `session_duration = "24h"` to preserve the previous behavior. ([ae4f5a1](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** the `allowed_authenticators` enum value `ssh_piv_key` has been renamed to `piv_key`, and a new value `ssh_fido2_key` has been added. Configurations using `"ssh_piv_key"` must be updated to `"piv_key"`. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_resource_library_application:** the `id` attribute type changed from `String` to `Int64`. The computed `intel_id` attribute has been removed. The `hostnames`, `ip_subnets`, `port_protocols`, `support_domains`, and `supported` attributes changed from `List` to `Set` (element ordering is no longer significant). These changes apply to both the resource data source and the list data source. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_resource_library_category:** the `id` attribute type changed from `String` to `Int64` on both the data source and list data source. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd:** the computed `is_pending_reconnect` attribute has been removed from `connections`. The upstream API no longer returns this field. Remove any references to `connections[*].is_pending_reconnect` from your configurations. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_warp_connector:** the computed `is_pending_reconnect` attribute has been removed from `connections`, matching the `zero_trust_tunnel_zenthcloudd` change above. ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))


### New Resources

* **zenthcloud_ct_alerting:** onboard new Terraform resource for Certificate Transparency alerting ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_precursor:** onboard new Terraform resource for Precursor ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))


### New Data Sources

* **zenthcloud_hostname_tls_settings:** add list data source for hostname TLS settings ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))


### Features

* bump Go SDK version to v7.9.0 ([79c7d4f](https://github.com/skygenesisenterprise/zenthcloud))
* **ai_gateway:** add `log_classification` attribute and `unified` billing mode ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **ai_search_instance:** add `discover_options` for link-following web crawler configuration ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **ai_search_namespace:** add `public_endpoint_params` with MCP, rate limiting, custom domains, and chat completions configuration ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **cloud_connector_rules:** add `oci_storage` cloud provider type ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **d1_database:** add `us` location restriction value ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer_pool:** add `health_sources` attribute for regional health steering ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** add vary parameter to set_cache_settings action ([e9cdc20](https://github.com/skygenesisenterprise/zenthcloud))
* **waiting_room:** add Latvian (`lv-LV`) language support ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **worker:** add `preview_url_suffix` and `url` computed attributes to subdomain block ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **worker_version:** add `messaging` binding type ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_ai_controls_mcp_portal:** add `code_mode` attribute for granular Code Mode policy control ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_ai_controls_mcp_server:** add `authentication_status` computed attribute ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** add worker destination types for Access ([118fe39](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_custom_page:** add `contract_version`, `warnings`, and new `type` values (`login`, `interstitial`) ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_service_token:** add `enabled` attribute to control service token activation ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_*_entry:** add computed `deprecated` attribute to all DLP entry resources and data sources ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** add `warp_auth_non_browser_401` attribute for non-browser 401 responses ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** add `webmcp_enabled` and `webmcp_packs` setting IDs ([ece27fe](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* guard against nil pointer dereference in dynamic semantic equality ([d82bbd5](https://github.com/skygenesisenterprise/zenthcloud))
* **image_variant:** fix nested variant response deserialization ([738bd28](https://github.com/skygenesisenterprise/zenthcloud))
* port v5.23.0 regression fixes from GitHub main ([ae4f5a1](https://github.com/skygenesisenterprise/zenthcloud))
* remove duplicate declarations causing build failures ([dc360d2](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* **image_variant:** update resource documentation ([bab4b71](https://github.com/skygenesisenterprise/zenthcloud))
* regenerate provider documentation ([79c7d4f](https://github.com/skygenesisenterprise/zenthcloud))
* restore .md extensions on internal guide cross-links ([f51c9d6](https://github.com/skygenesisenterprise/zenthcloud))


## 5.23.0 (2026-07-30)

Full Changelog: [v5.22.0...v5.23.0](https://github.com/skygenesisenterprise/zenthcloud)

### New Data Sources

* **zenthcloud_zero_trust_dlp_custom_prompt_topic:** add data source for DLP custom prompt topics ([ae6a505](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_dlp_custom_prompt_topics:** add list data source for DLP custom prompt topics ([ae6a505](https://github.com/skygenesisenterprise/zenthcloud))


### Features

* bump Go SDK version to v7.8.0 ([ae6a505](https://github.com/skygenesisenterprise/zenthcloud))
* **hyperdrive_config:** add v4 to v5 state migration ([cdd5ca6](https://github.com/skygenesisenterprise/zenthcloud))
* **turnstile_widget:** add `deployed_via` and `last_modified_via` computed fields, and default `offlabel` to `false` ([5952e95](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile:** add `global_acceleration` block for configuring custom tunnel and API endpoints ([5952e95](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_policy:** add `delete_headers` support in request header modification settings ([5952e95](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **d1_database:** initialize read_replication in state upgrader to prevent 400 error ([298799b](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer_pool:** preserve origins order to prevent perpetual drift ([aad09cc](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_ai_controls_mcp_portal:** migrate servers state from list to set ([9766b3a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** resolve perpetual diff by calling normalization in CRUD ([497f06b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile:** resolve perpetual drift on default, include, target_tests, and exclude nested attributes ([f74cecf](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile:** address review feedback on normalization ([969b35d](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dex_test:** remove stale model fields that caused value conversion panics during resource operations ([fd43d83](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** normalize mfa_required_for_all_apps to prevent perpetual diff ([001c28e](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** populate computed fields from a post-create read to prevent import drift ([fd43d83](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** fix `source.config` drift for API-populated fields by preserving computed state values ([c63f15e](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* add .terraform-registry for ownership transfer ([d33bc90](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([ae6a505](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* add workers_secret migration guidance with tf-migrate support ([524b26a](https://github.com/skygenesisenterprise/zenthcloud))
* fix account_subscription examples ([2ebc7db](https://github.com/skygenesisenterprise/zenthcloud))
* **migration-guide:** add table of contents to v5 migration guide ([e11e8a4](https://github.com/skygenesisenterprise/zenthcloud))
* regenerate provider documentation ([4656c9f](https://github.com/skygenesisenterprise/zenthcloud))
* resolve AI review doc warnings ([691131e](https://github.com/skygenesisenterprise/zenthcloud))


## 5.22.0 (2026-07-09)

Full Changelog: [v5.21.1...v5.22.0](https://github.com/skygenesisenterprise/zenthcloud)

### ⚠ BREAKING CHANGES

The following upstream API schema changes required corresponding provider schema updates. Existing state files load without user action (the plugin framework silently drops attributes that no longer exist in the schema), but Terraform **configurations** that still reference removed attributes must be updated before `terraform plan` will succeed.

* **ai_search_instance:** the `source_params.web_crawler.crawl_options` block has been removed. Zenthcloud's AI Search API dropped this field from its public schema in June 2026 and no longer accepts it, so keeping it in the provider would surface as a runtime API error rather than a plan-time error. Remove any `crawl_options { ... }` block from your `zenthcloud_ai_search_instance` configurations. ([0843c7f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_ai_controls_mcp_portal:** the `servers` attribute changed from a list to a set. HCL syntax is unchanged (`servers = [ ... ]`), but element ordering is no longer significant — Terraform will no longer plan a change when only the order of `servers` entries differs, and any code that relied on stable list ordering (e.g. `element(..., 0)`) may need to be updated. ([099fc24](https://github.com/skygenesisenterprise/zenthcloud))


### Notes

* **managed_transforms:** `managed_request_headers` and `managed_response_headers` are now `Optional` instead of `Required`. Existing configurations that set both blocks keep working unchanged; you may now omit either block if you don't need to manage those transforms. ([928173](https://github.com/skygenesisenterprise/zenthcloud))


### New Resources

* **zenthcloud_moq_relay:** onboard new Terraform resource for Media over QUIC (MoQ) relays ([9f2678c](https://github.com/skygenesisenterprise/zenthcloud))


### Features

* **d1_database:** add v4-to-v5 state upgrader ([32f42b1](https://github.com/skygenesisenterprise/zenthcloud))
* **d1_database:** add CRUD acceptance tests ([3491e69](https://github.com/skygenesisenterprise/zenthcloud))
* **hyperdrive_config:** add comprehensive acceptance tests ([59399bb](https://github.com/skygenesisenterprise/zenthcloud))
* **oauth:** add oauth_client resource CRUD support ([154668f](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** add acceptance tests for resource, data sources, and import ([26e0092](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add exports and package_dependencies to schema ([c15cef1](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** add `file` as valid RDP connection_rules value ([2659e30](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_short_lived_certificate:** add MoveState handler for access_ca_certificate rename (v4 -> v5 auto-migration) ([90f3324](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **dns_record:** dedupe schema key and drop unused import ([8faa422](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** revert Meta model to jsontypes.Normalized to match schema ([c0eea18](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** add .md extension to migration guide links ([7546f3e](https://github.com/skygenesisenterprise/zenthcloud))
* **hyperdrive_config:** address review feedback ([92ce892](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer_pool:** remove phantom flatten_cname from v4 source model ([baa1b92](https://github.com/skygenesisenterprise/zenthcloud))
* **migration:** correct v4 test configs and migration test harness for access_ca_certificate ([2c47cf7](https://github.com/skygenesisenterprise/zenthcloud))
* **moq_relay:** add schema Version: 500 ([890b9f9](https://github.com/skygenesisenterprise/zenthcloud))
* **oauth:** remove custom oauth visibility change ([6b4a0ed](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** add asset_name to v4 source schema so v4->v5 state upgrader parses correctly ([baa1b92](https://github.com/skygenesisenterprise/zenthcloud))
* **worker_version:** add CustomType to assets schema to match model ([7e7e0d3](https://github.com/skygenesisenterprise/zenthcloud))
* **worker_version:** use NestedObject accessors for Assets field ([78d419f](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** address review feedback ([3271949](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** resolve duplicate cache_options tag ([c15cef1](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_list:** handle ambiguous schema_version=0 state (v4 vs v5) ([c010f78](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **api:** force regen of moq_relay and email_routing_rule ([a9e500a](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** add 30m timeout to unit test shards ([635637b](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** trigger acceptance tests on release-tf-* branches ([5921d00](https://github.com/skygenesisenterprise/zenthcloud))
* **go.mod:** pin zenthcloud-go to release-770 branch head for v5.22.0 ([05272f3](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([c7a96ca](https://github.com/skygenesisenterprise/zenthcloud))
* use 'next' for Terraform builds ([30c04e6](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* **list:** fix missing comma in resource and data source examples ([bfe1c34](https://github.com/skygenesisenterprise/zenthcloud))
* regenerate provider docs; fix provider address and .stats.yml ([cbde062](https://github.com/skygenesisenterprise/zenthcloud))
* update documentation for moved blocks to Terraform 1.8 ([d93208d](https://github.com/skygenesisenterprise/zenthcloud))
* **v5-migration:** document session_duration behavior change for access policies ([90c58a7](https://github.com/skygenesisenterprise/zenthcloud))
* **v5-upgrade:** add destructive-behavior warning for app-scoped policy migration ([1e832d6](https://github.com/skygenesisenterprise/zenthcloud))
* **v5-upgrade:** document zone_id removal for access policies ([831f0bb](https://github.com/skygenesisenterprise/zenthcloud))


## 5.21.1 (2026-06-23)

Full Changelog: [v5.21.0...v5.21.1](https://github.com/skygenesisenterprise/zenthcloud)

### Bug Fixes

* **worker:** stop sending propagation_policy when not configured ([#7192](https://github.com/skygenesisenterprise/zenthcloud)) ([31d9a31](https://github.com/skygenesisenterprise/zenthcloud))

## 5.21.0 (2026-06-19)

Full Changelog: [v5.20.0...v5.21.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add new resources from staging-next ([e104922](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* add missing no-op state upgraders for version 0 -&gt; 500 ([692a0c6](https://github.com/skygenesisenterprise/zenthcloud)), closes [#7181](https://github.com/skygenesisenterprise/zenthcloud)
* restore account_id and zone_id as required on 156 resources ([62024cf](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add missing propagation_policy to observability traces schema ([78448d8](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** only sweep zones containing the cftftest prefix ([293ab21](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* Add acceptance tests for DLP data classification resources ([b85f20c](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** optimize CI workflow runtime ([7aa373f](https://github.com/skygenesisenterprise/zenthcloud))
* clean up ([e36c8a3](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* add docs for v5.20.1 release ([712db1d](https://github.com/skygenesisenterprise/zenthcloud))

## 5.20.0 (2026-06-13)

Full Changelog: [v5.19.1...v5.20.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add 11 new resources/data-sources from staging-next ([faab405](https://github.com/skygenesisenterprise/zenthcloud))
* add acceptance tests for google_tag_gateway resource ([f89e15f](https://github.com/skygenesisenterprise/zenthcloud))
* add acceptance tests for virtual_networks on zero_trust_device_custom_profile ([0625153](https://github.com/skygenesisenterprise/zenthcloud))
* add state upgraders for email_security_block_sender + impersonation_registry ([bc22174](https://github.com/skygenesisenterprise/zenthcloud))
* chore: skip failing deployment_groups tests ([614c726](https://github.com/skygenesisenterprise/zenthcloud))
* chore: skip failing Go SDK tests for workers bulk secret update ([69d2591](https://github.com/skygenesisenterprise/zenthcloud))
* chore: use zenthcloud-go v7.5.0 in Terraform build ([fd1ab3e](https://github.com/skygenesisenterprise/zenthcloud))
* chore: use released Go SDK for Terraform build ([e31d0f5](https://github.com/skygenesisenterprise/zenthcloud))
* chore: use released Go SDK for Terraform build ([858be78](https://github.com/skygenesisenterprise/zenthcloud))
* feat: add custom_csrs Stainless config (zone + account) ([0c37d4f](https://github.com/skygenesisenterprise/zenthcloud))
* feat: add custom_csrs Stainless config (zone + account) ([408836e](https://github.com/skygenesisenterprise/zenthcloud))
* feat: add resource library endpoints inside zero trust ([8f71612](https://github.com/skygenesisenterprise/zenthcloud))
* feat: move google_tag_gateway terraform resource from staging to production ([b4f6126](https://github.com/skygenesisenterprise/zenthcloud))
* feat(api): add zero_trust_device_deployment_groups resource ([3de6e62](https://github.com/skygenesisenterprise/zenthcloud))
* feat(api): add zero_trust_device_deployment_groups resource ([c852320](https://github.com/skygenesisenterprise/zenthcloud))
* feat(cache): add create (POST) method for smart_tiered_cache ([26568ea](https://github.com/skygenesisenterprise/zenthcloud))
* feat(cache): Update OPCR config to v2 endpoints (CACHE-13523) ([278c81f](https://github.com/skygenesisenterprise/zenthcloud))
* feat(dex): add device ISPs endpoint mapping ([4c7ad2c](https://github.com/skygenesisenterprise/zenthcloud))
* feat(dlp): add custom prompt topics endpoint [production] ([7732fd9](https://github.com/skygenesisenterprise/zenthcloud))
* feat(dlp): add custom prompt topics endpoint [production] ([305dab6](https://github.com/skygenesisenterprise/zenthcloud))
* feat(dlp): promote classification Stainless config to main ([d8803bd](https://github.com/skygenesisenterprise/zenthcloud))
* feat(flagship): add Flagship feature flag API resource mappings ([2b149cf](https://github.com/skygenesisenterprise/zenthcloud))
* feat(resource_sharing): add Terraform resource definitions for shares ([d83b268](https://github.com/skygenesisenterprise/zenthcloud))
* feat(snippets): add terraform id_property annotations for snippet and snippet_rules ([1781d02](https://github.com/skygenesisenterprise/zenthcloud))
* fix(iam): remove standalone_api from oauth_scopes subresource ([8af9cd0](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account_member:** missing upgrade path from v5.0-v5.15 ([d5c2a93](https://github.com/skygenesisenterprise/zenthcloud))
* add no-drift plan checks and domain precheck ([e4eaf52](https://github.com/skygenesisenterprise/zenthcloud))
* add read_only field to identity provider migration target model ([ac4ec4f](https://github.com/skygenesisenterprise/zenthcloud))
* align migration target models + schemas to fix parity tests ([f5ea496](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_settings:** nil pointer panic ([cf8099b](https://github.com/skygenesisenterprise/zenthcloud))
* **bot_management:** restore content_bots_protection handling in model.go ([d559753](https://github.com/skygenesisenterprise/zenthcloud))
* derive zone name from Read instead of missing API field ([0d5feef](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** prevent FQDN normalization from swallowing name shortening changes ([2131622](https://github.com/skygenesisenterprise/zenthcloud))
* **email_security_trusted_domains:** align model JSON tags with Optional schema ([5ee457f](https://github.com/skygenesisenterprise/zenthcloud))
* **email:** missed Optional revert + email_security_trusted_domains state upgrader ([8f3ddad](https://github.com/skygenesisenterprise/zenthcloud))
* gracefully handle nil pointer dereference when config has attributes_flat during migration ([589384d](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check_rule:** skip tests that require product enablement ([fc2d109](https://github.com/skygenesisenterprise/zenthcloud))
* **list:** nullify empty nested objects to prevent inconsistent result after apply ([7bcee4b](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer_pool:** accept early-v5 object-shape state at schema_version=0 ([23050e1](https://github.com/skygenesisenterprise/zenthcloud)), closes [#7098](https://github.com/skygenesisenterprise/zenthcloud)
* **load_balancer_pool:** add UseStateForUnknown for load_shedding attribute to prevent drift ([3fc31ee](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_custom_domain:** restore degraded-response handling in resource.go ([b3d01a0](https://github.com/skygenesisenterprise/zenthcloud))
* **regional_hostname:** update zenthcloud-go imports from v6 to v7 ([d4211c4](https://github.com/skygenesisenterprise/zenthcloud))
* register regional_hostname in provider.go ([3a87345](https://github.com/skygenesisenterprise/zenthcloud))
* resolve pre-existing v6/v7 and codegen-drift build errors ([27aed32](https://github.com/skygenesisenterprise/zenthcloud))
* restore handwritten code stripped from staging-next codegen for acceptance tests ([6920a59](https://github.com/skygenesisenterprise/zenthcloud))
* restore production files lost to codegen drift on staging-next ([1bba117](https://github.com/skygenesisenterprise/zenthcloud))
* restore site_id/queue_id path tags to 'required' in data source models ([56b6a34](https://github.com/skygenesisenterprise/zenthcloud))
* **secrets_store:** fix model/schema parity and guard acceptance tests ([dde9b24](https://github.com/skygenesisenterprise/zenthcloud))
* set initial schema version to 500 for all new resources ([ef71ba4](https://github.com/skygenesisenterprise/zenthcloud))
* **spectrum_application:** accept early-v5 object-shape state at schema_version=0 ([bdcaa79](https://github.com/skygenesisenterprise/zenthcloud)), closes [#7098](https://github.com/skygenesisenterprise/zenthcloud)
* **tests:** bump v6→v7 imports in restored hand-written tests ([4cf7eff](https://github.com/skygenesisenterprise/zenthcloud))
* treeshaking required fields from optional ([94198f3](https://github.com/skygenesisenterprise/zenthcloud))
* undo two over-corrections from previous batch ([08a3561](https://github.com/skygenesisenterprise/zenthcloud))
* update go.sum and fix RecipientNewParams field rename ([931cb9f](https://github.com/skygenesisenterprise/zenthcloud))
* **worker_version:** restore handwritten D1 database_id handling ([ed78cd0](https://github.com/skygenesisenterprise/zenthcloud))
* **worker:** add propagation_policy to grandparent observability Default ([c815f52](https://github.com/skygenesisenterprise/zenthcloud))
* **worker:** include propagation_policy in observability.traces parent Default + update data source test ([541fe77](https://github.com/skygenesisenterprise/zenthcloud))
* **worker:** preserve observability.traces.propagation_policy across reads ([458854e](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** Missing CertId field in state migration ([17d852f](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** restore annotations Computed + workers_triggered_by ([d3d033a](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** restore annotations Read workaround stripped by staging-next codegen ([d4f824f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** skip MFA infrastructure test ([4dd2f87](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** add UseStateForUnknown to SAML-only config fields ([451e078](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** change read_only from computed to optional ([b760efe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** drop universal Default on SAML-only config fields ([f297a75](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** use UseNonNullStateForUnknown on scim_config.scim_base_url ([55a8860](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** use UseNonNullStateForUnknown on scim_config.secret ([4dab13d](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** Missing common_names transform in migration ([ce95d8c](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** populate account_id when migrating zone-scoped v4 state ([513a91c](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_predefined_profile:** skip tests that require account-level OCR ([caed432](https://github.com/skygenesisenterprise/zenthcloud))


### Reverts

* **token:** drop custom.go restore to let PR [#7148](https://github.com/skygenesisenterprise/zenthcloud) land cleanly ([04f46b5](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* add feature request issue template ([eee01fe](https://github.com/skygenesisenterprise/zenthcloud))
* **api_token:** skip test not supported by account ([5056f63](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([fdcb705](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([b4ace62](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([408be20](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([37e67c1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([5f2a7bd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([06e6ffc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([63b0963](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d634850](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0861a6a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([7d350ac](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([14e308c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([9376903](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([a83865d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([1c1ae98](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([17d1f43](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([7537630](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([630c740](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([921b330](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([61b0057](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([007d65d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([87325df](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([5b6f63b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([796b467](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([29cb63f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([6fb099e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([c0f463a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([4b4f4e1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([cced166](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([1f0ef10](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([3d0cc20](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([3bfa07f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([b8d2fcb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([87be50c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0165de6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([9cf975a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([f0f1f80](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([04bd66d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([2309417](https://github.com/skygenesisenterprise/zenthcloud))
* clarify description in feature request template ([892847a](https://github.com/skygenesisenterprise/zenthcloud))
* **deps:** migrate from zenthcloud-go/v6 to /v7 ([6d752b6](https://github.com/skygenesisenterprise/zenthcloud))
* docs and examples ([cd5cd44](https://github.com/skygenesisenterprise/zenthcloud))
* generate docs ([420ed0b](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([61c4f94](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([22d50b7](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([6000928](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([8d83c78](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f564ed6](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([9b7e360](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([9666ea8](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0419104](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([4e2a053](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([5f7e773](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0ea98f0](https://github.com/skygenesisenterprise/zenthcloud))
* restore schema version ([470abf1](https://github.com/skygenesisenterprise/zenthcloud))
* revert unwanted generated code ([5e2e81d](https://github.com/skygenesisenterprise/zenthcloud))
* use 'next' for Terraform builds ([5e3bd48](https://github.com/skygenesisenterprise/zenthcloud))
* use v7 ([a9b2b8e](https://github.com/skygenesisenterprise/zenthcloud))
* use v7 for all test; 2 resources have missing methods in v7 so use v6 for those two resources ([1c6e86c](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile:** skip virtual network test ([48cc36f](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* regenerate provider docs ([e86855d](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** document in-place migration for policy UUIDs ([555fa3f](https://github.com/skygenesisenterprise/zenthcloud))


### Refactors

* extract MoveState nil guard into shared helper ([737caf9](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.1 (2026-04-30)

Full Changelog: [v5.19.0...v5.19.1](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add user_group and user_group_members acceptance tests + custom delete ([7f2420e](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **iam:** tokens migrations ([52c5675](https://github.com/skygenesisenterprise/zenthcloud))
* **list_item:** ambigous schema while upgrade ([8d75670](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_group:** fix v4 migration of same name ([918f9b6](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* unskip rate limited test for future ([5f785f9](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_settings:** document available settings ([26711da](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_settings:** document available settings dynamically ([a885ddc](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.0 (2026-04-24)

Full Changelog: [v5.18.0...v5.19.0](https://github.com/skygenesisenterprise/zenthcloud)

### New Resources

* **zenthcloud_ai_gateway:** Manage AI Gateway instances ([e8d7f3b](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_certificate_authorities_hostname_associations:** Manage mTLS certificate hostname associations ([97df6f2](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_custom_page_asset:** Manage custom page assets ([8b71d20](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_pipeline:** Manage Zenthcloud Pipelines ([de21a25](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_r2_data_catalog:** Manage R2 Data Catalog ([e8d7f3b](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_user_group:** Manage user groups ([4cf8755](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_user_group_members:** Manage user group memberships ([4cf8755](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_vulnerability_scanner_credential:** Manage vulnerability scanner credentials ([4cf8755](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_vulnerability_scanner_credential_set:** Manage vulnerability scanner credential sets ([4cf8755](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_vulnerability_scanner_target_environment:** Manage vulnerability scanner target environments ([4cf8755](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_workers_observability_destination:** Manage Workers Observability destinations ([312d3af](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_device_ip_profile:** Manage Zero Trust device IP profiles ([7b251d2](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_device_subnet:** Manage Zero Trust device subnets ([ebb8216](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_dlp_settings:** Manage Zero Trust DLP settings ([4cf8755](https://github.com/skygenesisenterprise/zenthcloud))


### Features

* **account:** state upgrader for v4 to v5 migration ([82ee06e](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** state upgrader for v4 to v5 migration ([62d0ea7](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** state upgrader for v4 to v5 migration ([a0469d7](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls:** state upgrader for v4 to v5 migration ([c4054b7](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_hostname_certificate:** state upgrader for v4 to v5 migration ([c4054b7](https://github.com/skygenesisenterprise/zenthcloud))
* **byo_ip_prefix:** state upgrader for v4 to v5 migration ([8d58cab](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname:** state upgrader for v4 to v5 migration ([24e4f0e](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_ssl:** state upgrader for v4 to v5 migration ([ada4f8f](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check:** state upgrader for v4 to v5 migration ([9372a7d](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check_rule:** state upgrader for v4 to v5 migration ([745f1e2](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_ownership_challenge:** state upgrader for v4 to v5 migration ([25785268](https://github.com/skygenesisenterprise/zenthcloud))
* **mtls_certificate:** state upgrader for v4 to v5 migration ([70d46e0](https://github.com/skygenesisenterprise/zenthcloud))
* **observatory_scheduled_test:** state upgrader for v4 to v5 migration ([a2883c9](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_domain:** state upgrader for v4 to v5 migration ([91c6024](https://github.com/skygenesisenterprise/zenthcloud))
* **regional_tiered_cache:** state upgrader for v4 to v5 migration ([430edbd](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** add `content_converter` and `redirects_for_ai_training` support to configuration rules ([726b8e7](https://github.com/skygenesisenterprise/zenthcloud))
* **turnstile_widget:** state upgrader for v4 to v5 migration ([94b9515](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** state upgrader for v4 to v5 migration ([6a40c69](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile:** state upgrader for v4 to v5 migration ([77090dc](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile:** state upgrader for v4 to v5 migration ([77090dc](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_integration:** state upgrader for v4 to v5 migration ([32bc328](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_certificate:** state upgrader for v4 to v5 migration ([ceff5a4](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_settings:** state upgrader for v4 to v5 migration ([3dae4a3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_logging:** make importable ([c5d144b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** state upgrader for v4 to v5 migration ([9eb3a25](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_virtual_network:** state upgrader for v4 to v5 migration ([1f0f135](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** state upgrader for v4 to v5 migration ([7ba7600](https://github.com/skygenesisenterprise/zenthcloud))
* add browser rendering devtools methods ([7f83203](https://github.com/skygenesisenterprise/zenthcloud))
* bump go sdk version ([070ea0b](https://github.com/skygenesisenterprise/zenthcloud))
* enable treeshaking and client options for setting zone and account IDs ([43b90cb](https://github.com/skygenesisenterprise/zenthcloud))
* promote AI Gateway Terraform config from staging to main ([75baa04](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account_member:** add UseStateForUnknown to status field to prevent drift ([841d6f9](https://github.com/skygenesisenterprise/zenthcloud))
* **ai_search_instance:** restore original defaults for cache and cache_threshold ([d28ee6b](https://github.com/skygenesisenterprise/zenthcloud))
* **apijson:** return empty object from MarshalForPatch when no fields are serialisable ([270fe86](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_settings:** fix no prior schema and no-op upgrade ([9804de7](https://github.com/skygenesisenterprise/zenthcloud))
* **certificate_pack:** initialize empty lists instead of null in state upgrader to prevent drift ([2017a43](https://github.com/skygenesisenterprise/zenthcloud))
* **client_certificate:** fix CSR drift with normalization ([a755419](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname:** allow ssl as null ([6e17010](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname_fallback_origin:** eventual consistency ([d55a74a](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_origin_trust_store:** fix certificate drift with normalization ([42de890](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_ssl:** fix patch cert replacement and send bundle_method ([bebe53b](https://github.com/skygenesisenterprise/zenthcloud))
* **dlp_predefined_profile:** eliminate perpetual entries and enabled_entries drift ([92dcfc0](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** avoid unnecessary drift for ipv4_only and ipv6_only attributes ([3df5e03](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** remove private_routing default value ([ada77b4](https://github.com/skygenesisenterprise/zenthcloud))
* **drift:** preserve prior state for optional fields not returned by API (access_rule, gateway_policy, gateway_settings, zone_dnssec, dlp_predefined_profile) ([b717f4d](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check_rule:** handle empty ID from v4 provider state migration ([70f0337](https://github.com/skygenesisenterprise/zenthcloud))
* **list_item:** remove context ([69f751d](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_job:** update model for migration ([b789273](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_job:** fix acceptance tests failing due to destination re-validation on PUT ([87243a1](https://github.com/skygenesisenterprise/zenthcloud))
* **managed_transforms:** remove unavailable rule and fix nil pointer in state upgrade ([d14644e](https://github.com/skygenesisenterprise/zenthcloud))
* **migrations:** handle ambiguous schema_version state for v4/v5 coexistence ([2b6246f](https://github.com/skygenesisenterprise/zenthcloud))
* **page_rule:** properly encode automatic_https_rewrites ([47ebbf4](https://github.com/skygenesisenterprise/zenthcloud))
* provider credential fields marked sensitive and validation regex updated ([5f6ff4f](https://github.com/skygenesisenterprise/zenthcloud))
* **r2:** add degraded-response handling to the R2 custom domain resource ([c8d0e0f](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** restore phase-entrypoint fallbacks ([b92500b](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** add redirects_for_ai_training to v4 action parameters model ([16470fa](https://github.com/skygenesisenterprise/zenthcloud))
* **tokens:** change from set to list for token policies ([9937847](https://github.com/skygenesisenterprise/zenthcloud))
* **tokens:** handle revoked and expired tokens ([63319ed](https://github.com/skygenesisenterprise/zenthcloud))
* UpgradeFromV0 handles both v4 and early-v5 state formats ([b09f658](https://github.com/skygenesisenterprise/zenthcloud))
* use raw JSON deserialization in UpgradeState handlers ([0e93ea6](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** handle HTTP 200 no content header ([ea0ca97](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add missing ratelimit binding type to schema validator ([30c49a6](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** model drift ([5ae89c4](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** boolean drifts ([421bb50](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** nil pointer panic in state upgrader ([ebe2b68](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** normalize transforms and use raw JSON deserialization for state upgrade ([18c2ae3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_managed_networks:** upgrade resource state ([7c14bf5](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** schema default removed intentionally ([eef56df](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_policy:** make filters Computed+Optional to prevent drift ([8f52f45](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_settings:** breaking changes and reset to clean defaults ([b5ca509](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_config:** dont use init ([090ff6a](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **api:** update composite API spec ([db5b37e](https://github.com/skygenesisenterprise/zenthcloud))
* **cmd/migrate:** deprecated in favor of [tf-migrate](https://github.com/skygenesisenterprise/zenthcloud); will be removed in a future release ([#7062](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** caveats and callouts ([31c0d88](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([4cf8755](https://github.com/skygenesisenterprise/zenthcloud))
* update tf-migrate version ([d023e25](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* remove TBD wording from deprecation timeline ([bce670f](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.0-beta.5 (2026-04-07)

Full Changelog: [v5.19.0-beta.4...v5.19.0-beta.5](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* chore: bump go sdk version ([6e48004](https://github.com/skygenesisenterprise/zenthcloud))
* feat: bump schema version to 500 ([aadbc10](https://github.com/skygenesisenterprise/zenthcloud))
* fix: make prism default server ([d2a18c9](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **ai_search_instance:** conflict resolution ([f6c3236](https://github.com/skygenesisenterprise/zenthcloud))
* **CI:** pin go releaser ([700c4e3](https://github.com/skygenesisenterprise/zenthcloud))
* **CI:** pin go releaser to latest ([a8f99a2](https://github.com/skygenesisenterprise/zenthcloud))
* **CI:** unit tests ([09bfd8b](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** Remove private_routing default value ([ada77b4](https://github.com/skygenesisenterprise/zenthcloud))
* duplicate attributes ([82c4128](https://github.com/skygenesisenterprise/zenthcloud))
* **list_item:** remove context ([69f751d](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_job:** update model for migration ([b789273](https://github.com/skygenesisenterprise/zenthcloud))
* mark provider credential fields as sensitive and update validation regex ([5f6ff4f](https://github.com/skygenesisenterprise/zenthcloud))
* migration model parity ([267b81e](https://github.com/skygenesisenterprise/zenthcloud))
* **worker:** Add UseStateForUnknown() plan modifiers and update tests for observability.traces ([8cfe12d](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** handle http 200 no content header ([ea0ca97](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** upate assertions ([000f0b1](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** nil pointer panic in state upgrader ([ebe2b68](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** set PriorSchema nil for v4 state upgrade (TKT-007) ([4d64732](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **ci:** bump tf-migrate version ([64d58ef](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** disk clean up ([cc1ebca](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** regen docs ([d3948b8](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([c5fdb89](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f593d24](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([e71aa0e](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* **healthcheck:** update port description to clarify defaults ([1860800](https://github.com/skygenesisenterprise/zenthcloud))


### Refactors

* **ci:** improve release time ([d8bb69d](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.0-beta.4 (2026-03-30)

Full Changelog: [v5.19.0-beta.3...v5.19.0-beta.4](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **docs:** update migration guide ([6fc1e14](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** migration model parity tests ([b6d60d7](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **healthcheck:** use buildHealthcheckPlanChecks helper for correct plan checks per migration source ([f5746e2](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset/v500:** add redirects_for_ai_training to SourceV4ActionParametersModel ([16470fa](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** fix migration ([a07c0da](https://github.com/skygenesisenterprise/zenthcloud))
* **rulesets:** duplicate model attribute ([819a40c](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** fix testdata ([866f6ac](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_settings:** breaking changes ([b5ca509](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_settings:** implement sweeper to reset account to clean defaults ([d996a66](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **pipeline_resources:** update docs ([edfa566](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.0-beta.3 (2026-03-27)

Full Changelog: [v5.19.0-beta.2...v5.19.0-beta.3](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **zone_setting:** modernize migration tests ([aa8d74d](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* acceptance and migration tests ([49873e6](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_settings:** fix no prior schema ([9804de7](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_settings:** no-op upgrade ([ffdb7b1](https://github.com/skygenesisenterprise/zenthcloud))
* **certificate_pack:** initialize empty lists instead of null in state upgrader ([2017a43](https://github.com/skygenesisenterprise/zenthcloud))
* **dlp_predefined_profile:** eliminate perpetual entries and enabled_entries drift ([92dcfc0](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** avoid unnecessary drift for ipv4_only and ipv6_only attributes ([3df5e03](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** GetResourceRename limitations ([18fed9a](https://github.com/skygenesisenterprise/zenthcloud))
* dont run migration tests in unit test job ([1fbf857](https://github.com/skygenesisenterprise/zenthcloud))
* **drift:** preserve prior state values for optional fields not returned by API ([b717f4d](https://github.com/skygenesisenterprise/zenthcloud))
* **healthcheck:** udpate assertions ([5ba668f](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check_rule:** handle empty ID from v4 provider state migration ([70f0337](https://github.com/skygenesisenterprise/zenthcloud))
* **migrations:** handle ambiguous schema_version state for v4/v5 coexistence ([2b6246f](https://github.com/skygenesisenterprise/zenthcloud))
* use raw JSON deserialization in UpgradeState handlers (TKT-007 through TKT-011) ([0e93ea6](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** model drift ([5ae89c4](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** boolean drifts ([421bb50](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** fix unreferenced const ([3538844](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_managed_networks:** upgrade resource state ([7c14bf5](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_policy:** make filters Computed+Optional to prevent drift ([8f52f45](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** actually write correct testdata file content ([d249365](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** add import blocks to v5 migration testdata ([8064042](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** correct migration testdata and test structure ([b1b5932](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** pass --yes to tf-migrate in migration test harness ([8db5673](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** remove obsolete state entries before terraform plan in migration tests ([4b49603](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **ci:** bump tf-migrate version ([4c191a1](https://github.com/skygenesisenterprise/zenthcloud))
* **pipeline_resources:** sync codegen ([ec187bf](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* add application-scoped access policy migration guidance ([40d7d43](https://github.com/skygenesisenterprise/zenthcloud))
* update zone_settings_override migration guide for tf-migrate v2 workflow ([5a46008](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.0-beta.2 (2026-03-17)

Full Changelog: [v5.19.0-beta.1...v5.19.0-beta.2](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **account_member:** state upgrade ([62d0ea7](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** version 500 and upgrade path ([a0469d7](https://github.com/skygenesisenterprise/zenthcloud))
* **account:** state upgrader ([82ee06e](https://github.com/skygenesisenterprise/zenthcloud))
* **byo_ip_prefix:** add migrations test ([da3d2f6](https://github.com/skygenesisenterprise/zenthcloud))
* **certificate_authorities_hostname_associations:** add mtls cert id query param and lifecycle tests ([97df6f2](https://github.com/skygenesisenterprise/zenthcloud))
* chore(terraform): point go to next branch ([14f1093](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** include resources in run ci ([a666cc5](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** make unit tests fast ([cb2f2c6](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_ssl:** state upgrader ([ada4f8f](https://github.com/skygenesisenterprise/zenthcloud))
* feat(ip_profile): onboard new terraform resource zenthcloud_zero_trust_device_ip_profile ([7b251d2](https://github.com/skygenesisenterprise/zenthcloud))
* feat(pipelines): add terraform resources ([de21a25](https://github.com/skygenesisenterprise/zenthcloud))
* feat(r2_data_catalog): add Terraform resource ([e8d7f3b](https://github.com/skygenesisenterprise/zenthcloud))
* feat(workers): WO-989 Adds Workers&gt;Observability>Destinations resources ([312d3af](https://github.com/skygenesisenterprise/zenthcloud))
* feat(zero_trust_device_subnet): onboard new terraform resource zenthcloud_zero_trust_device_subnet ([ebb8216](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_ownership_challenge:** state upgrader ([2578526](https://github.com/skygenesisenterprise/zenthcloud))
* **mtls_certificate:** state upgrader ([70d46e0](https://github.com/skygenesisenterprise/zenthcloud))
* **observatory_scheduled_test:** add migration and state upgraders logic ([89f123e](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** add content_converter support to configuration rules ([726b8e7](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** state upgraders ([6a40c69](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile, zenthcloud_zero_trust_local_fallback_domain:** state upgraders ([77090dc](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_ip_profile:** onboard new terraform resource zenthcloud_zero_trust_device_ip_profile ([991da77](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_integration:** state upgrader ([32bc328](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_certificate:** state upgrader ([ceff5a4](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_settings:** state upgraders ([3dae4a3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_split_tunnel:** Update migration guide ([7e2bedc](https://github.com/skygenesisenterprise/zenthcloud))
* **zt_tunnel_virtual_network:** support state upgraders ([1f0f135](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account_member|ruleset:** migration tests ([3369f6b](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** emails in tests ([0c16559](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** skip acceptance test during unit tests ([0f6399f](https://github.com/skygenesisenterprise/zenthcloud))
* **apijson:** return empty object from MarshalForPatch when no fields are serialisable ([270fe86](https://github.com/skygenesisenterprise/zenthcloud))
* cascading deletions with malformed refreshed zone ID ([e494e8f](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** migration tests ([d05bec5](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname_fallback_origin:** eventual consistency ([d55a74a](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname_fallback_origin:** skip if TF_ACC is not set ([b12af2b](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname:** allow ssl as null ([6e17010](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_ssl:** fix patch cert replacement and send bundle_method ([bebe53b](https://github.com/skygenesisenterprise/zenthcloud))
* drift in migration ([8e8edf9](https://github.com/skygenesisenterprise/zenthcloud))
* **healthcheck:** acceptance and migration tests ([4f8a8c2](https://github.com/skygenesisenterprise/zenthcloud))
* **healthcheck:** model schema parity ([8ccf8e8](https://github.com/skygenesisenterprise/zenthcloud))
* migration tests ([797b79a](https://github.com/skygenesisenterprise/zenthcloud))
* **page_rule:** properly encode page_rule automatic_https_rewrites ([47ebbf4](https://github.com/skygenesisenterprise/zenthcloud))
* schema collision ([a2a4642](https://github.com/skygenesisenterprise/zenthcloud))
* schema detection ([dd216f9](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** migration related bugs ([4d1149b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** normalize transforms ([18c2ae3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile:** skip PATCH when MarshalForPatch returns nil ([8f29013](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_managed_networks:** acceptance and migration tests ([df26983](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** schema default was removed intentionally ([eef56df](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_config:** acceptance and migration tests ([c96ccce](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_config:** dont use init ([090ff6a](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **account_member:** skip test for ci user due to API behavior ([b7e1850](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** fix directory structure ([299568f](https://github.com/skygenesisenterprise/zenthcloud))
* **auth_origin_pulls_cert:** add test cases for migration ([f83cefe](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_hostname_certificate:** skip, api conflict ([a2c5865](https://github.com/skygenesisenterprise/zenthcloud))
* bump all remaining resources to schema version 500 ([c424347](https://github.com/skygenesisenterprise/zenthcloud))
* **changelog:** update changelog ([76d1b49](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** build ([3bc6024](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** parallel in shards ([c53a182](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** pin go ([ca49baf](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** use beta.5 tf-migrate release ([9eb3a25](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** use latest tf-migrate release ([7088d5b](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname:** add state upgraders logic ([24e4f06](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** regen docs ([e1a1591](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** update v5 guide templates ([307f275](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([7a07092](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([925fe31](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check_rule:** add state upgraders ([745f1e2](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check:** add state upgraders ([9372a7d](https://github.com/skygenesisenterprise/zenthcloud))
* **queue_consumer:** skip tests with recurring diff ([802799b](https://github.com/skygenesisenterprise/zenthcloud))
* **regional_tiered_cache:** add state upgraders logic ([430edbd](https://github.com/skygenesisenterprise/zenthcloud))
* **resources:** remove state upgrader gaurds ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* skips ([a7f8af6](https://github.com/skygenesisenterprise/zenthcloud))
* **turnstile_widget:** add state upgraders logic ([94b9515](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_subnet:** add default values to 'is_default_network' and 'comment' ([bf6b267](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_subnet:** add default values to 'is_default_network' and 'comment' ([09ebd61](https://github.com/skygenesisenterprise/zenthcloud))
* **zt_organization:** support state upgraders ([9eb2864](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.0-beta.2

Full Changelog: [v5.19.0-beta.1...HEAD](https://github.com/skygenesisenterprise/zenthcloud)

### New Resources

* **zenthcloud_pipeline:** Manage Zenthcloud Pipelines ([de21a25](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_pipeline_sink:** Manage Pipeline sinks ([de21a25](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_pipeline_stream:** Manage Pipeline streams ([de21a25](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_r2_data_catalog:** Manage R2 Data Catalog ([e8d7f3b](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_workers_observability_destination:** Manage Workers Observability Destinations ([312d3af](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_device_ip_profile:** Manage Zero Trust device IP profiles ([991da77](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_device_subnet:** Manage Zero Trust device subnets ([ebb8216](https://github.com/skygenesisenterprise/zenthcloud))

### Features

* **ruleset:** add `content_converter` support to configuration rules ([726b8e7](https://github.com/skygenesisenterprise/zenthcloud))

### State Upgraders (v4 → v5 Migration)

The following resources now support automatic state migration from v4 to v5:

* **access_rule:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **account:** state upgrader ([82ee06e](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** state upgrader ([62d0ea7](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** state upgrader ([a0469d7](https://github.com/skygenesisenterprise/zenthcloud))
* **api_shield:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **api_shield_operation:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls:** state upgrader ([c4054b7](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_certificate:** state upgrader ([c4054b7](https://github.com/skygenesisenterprise/zenthcloud))
* **byo_ip_prefix:** state upgrader ([ba89adb](https://github.com/skygenesisenterprise/zenthcloud))
* **certificate_pack:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname:** state upgrader ([24e4f06](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname_fallback_origin:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_ssl:** state upgrader ([ada4f8f](https://github.com/skygenesisenterprise/zenthcloud))
* **image_variant:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check:** state upgrader ([9372a7d](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check_rule:** state upgrader ([745f1e2](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_ownership_challenge:** state upgrader ([2578526](https://github.com/skygenesisenterprise/zenthcloud))
* **mtls_certificate:** state upgrader ([70d46e0](https://github.com/skygenesisenterprise/zenthcloud))
* **notification_policy:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **observatory_scheduled_test:** state upgrader ([89f123e](https://github.com/skygenesisenterprise/zenthcloud))
* **origin_ca_certificate:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_domain:** state upgrader ([91c6024](https://github.com/skygenesisenterprise/zenthcloud))
* **queue:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **queue_consumer:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **regional_tiered_cache:** state upgrader ([430edbd](https://github.com/skygenesisenterprise/zenthcloud))
* **turnstile_widget:** state upgrader ([94b9515](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_custom_domain:** state upgrader ([6a40c69](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_for_platforms_dispatch_namespace:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile_local_domain_fallback:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile:** state upgrader ([77090dc](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile_local_domain_fallback:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_managed_networks:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_integration:** state upgrader ([32bc328](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dex_test:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_predefined_profile:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_certificate:** state upgrader ([ceff5a4](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_settings:** state upgrader ([3dae4a3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** state upgrader ([9eb2864](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_config:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_route:** state upgrader enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_virtual_network:** state upgrader ([1f0f135](https://github.com/skygenesisenterprise/zenthcloud))

### Bug Fixes

* **ai_search_instance:** restore original defaults for `cache` and `cache_threshold` ([d28ee6b](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname:** allow `ssl` attribute to be null ([6e17010](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_ssl:** fix patch cert replacement and send `bundle_method` ([bebe53b](https://github.com/skygenesisenterprise/zenthcloud))
* **healthcheck:** fix model schema parity ([8ccf8e8](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_ownership_challenge:** preserve `filename` during state migration ([b9e44f2](https://github.com/skygenesisenterprise/zenthcloud))
* **magic_wan_static_route:** fix apply failure when `description` is unset ([512bd2e](https://github.com/skygenesisenterprise/zenthcloud))
* **page_rule:** properly encode `automatic_https_rewrites` ([47ebbf4](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** add `content_converter` to migration model for v4→v5 state upgrade compatibility ([3369f6b](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** fix cascading deletions with malformed refreshed zone ID ([e494e8f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_policy:** normalize transforms ([18c2ae3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile:** skip PATCH when MarshalForPatch returns nil ([8f29013](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** preserve intentionally removed schema default ([eef56df](https://github.com/skygenesisenterprise/zenthcloud))
* **account:** fix state upgrader to handle early v5 state (schema_version=0 collision with v4)
* **zero_trust_dex_test:** fix state upgrader to handle early v5 state (schema_version=0 collision with v4)

### Documentation

* **zero_trust_split_tunnel:** update migration guide ([7e2bedc](https://github.com/skygenesisenterprise/zenthcloud))

### Tests

* **ai_search_instance:** add acceptance tests ([2255c5e](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_data_catalog:** add acceptance tests ([4e25d26](https://github.com/skygenesisenterprise/zenthcloud))

### Chores

* **ci:** use latest tf-migrate release v1.0.0-beta.3 ([7088d5b](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** improve test parallelization in shards ([c53a182](https://github.com/skygenesisenterprise/zenthcloud))
* **resources:** remove state upgrader guards - all state upgraders now enabled ([d69545f](https://github.com/skygenesisenterprise/zenthcloud))
* **resources:** bump all remaining resources to schema version 500 ([c4243470](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_subnet:** add default values to `is_default_network` and `comment` ([bf6b267](https://github.com/skygenesisenterprise/zenthcloud))

## 5.19.0-beta.1 (2026-03-03)

> **Disclaimer:** Please note that v1.0.0-beta.1 is in Beta and we are still testing it for stability.

### Migration Support Release

This release enables **automatic state upgraders** for v4 to v5 migrations, dramatically simplifying the upgrade path. Combined with the [tf-migrate](https://github.com/skygenesisenterprise/zenthcloud) CLI tool for HCL configuration changes, migrating to v5 is now significantly easier than before.

#### Key Highlights

- **Automatic State Migration**: 60+ resources now include built-in state upgraders that automatically transform v4 (SDKv2) state to v5 (Plugin Framework) state during `terraform plan` or `terraform apply`. No manual state file editing required.

- **tf-migrate CLI Tool**: A new CLI tool handles HCL configuration rewrites, `moved` block generation, and cross-file reference updates. Download from [tf-migrate releases](https://github.com/skygenesisenterprise/zenthcloud).

- **Grit Deprecation**: Grit-based migrations are now deprecated and will be removed in a future release. Use `tf-migrate` instead.

- **New Migration Guide**: See the [version 5 migration guide](https://github.com/skygenesisenterprise/zenthcloud) for the recommended migration path.

#### Upgrade Path Requirements

| Your Current Version | Action Required |
|---|---|
| v4.x (any version) | Upgrade to v4.52.5 first, then follow the migration guide |
| v5.0 -- v5.16 | **Must upgrade to v5.17 or v5.18 first**, then upgrade to v5.19+ |
| v5.17 -- v5.18 | Upgrade directly to v5.19+ |
| v5.19+ | Normal minor version upgrade |

> **Important**: Users on v5.16 or earlier using any of the [17 stepping-stone resources](https://github.com/skygenesisenterprise/zenthcloud) must upgrade to v5.17/v5.18 before v5.19 to ensure correct state upgrader execution.

---

### Resources with State Upgraders (v4 to v5 transformation)

The following **61 resources** now include state upgraders that automatically transform state from v4 format to v5:

| Category | Resources |
|----------|-----------|
| **Zones & DNS** | `zone`, `zone_dnssec`, `zone_subscription`, `dns_record` |
| **Load Balancing** | `load_balancer`, `load_balancer_monitor`, `load_balancer_pool` |
| **Cache & Performance** | `tiered_cache`, `argo_smart_routing`, `argo_tiered_caching`, `page_rule`, `ruleset` |
| **Workers** | `workers_script`, `workers_route`, `workers_kv`, `workers_kv_namespace`, `workers_for_platforms_dispatch_namespace` |
| **Pages** | `pages_project` |
| **Logs & Analytics** | `logpush_job`, `logpull_retention` |
| **Security** | `access_rule`, `api_shield`, `api_shield_operation`, `bot_management`, `custom_pages`, `healthcheck` |
| **Certificates** | `certificate_pack`, `origin_ca_certificate`, `authenticated_origin_pulls_certificate`, `authenticated_origin_pulls_settings` |
| **Rules & Lists** | `list`, `list_item`, `managed_transforms`, `regional_hostname`, `snippet`, `snippet_rules`, `url_normalization_settings` |
| **Spectrum** | `spectrum_application` |
| **Queues** | `queue`, `queue_consumer` |
| **R2** | `r2_bucket` |
| **Notifications** | `notification_policy`, `notification_policy_webhooks` |
| **API Tokens** | `api_token` |
| **Custom Hostnames** | `custom_hostname_fallback_origin` |
| **Zero Trust Access** | `zero_trust_access_application`, `zero_trust_access_group`, `zero_trust_access_identity_provider`, `zero_trust_access_mtls_certificate`, `zero_trust_access_mtls_hostname_settings`, `zero_trust_access_policy`, `zero_trust_access_service_token` |
| **Zero Trust Devices** | `zero_trust_device_managed_networks`, `zero_trust_device_posture_rule`, `zero_trust_dex_test` |
| **Zero Trust DLP** | `zero_trust_dlp_custom_profile`, `zero_trust_dlp_predefined_profile` |
| **Zero Trust Gateway** | `zero_trust_gateway_policy`, `zero_trust_list` |
| **Zero Trust Tunnels** | `zero_trust_tunnel_zenthcloudd`, `zero_trust_tunnel_zenthcloudd_config`, `zero_trust_tunnel_zenthcloudd_route` |

---

### Resources with Schema Version Bump (no-op upgraders)

The following **31 resources** received schema version bumps to v500 with no-op state upgraders (state format unchanged, version tracking only):

| Category | Resources |
|----------|-----------|
| **Account** | `account_member`, `address_map` |
| **Email Routing** | `email_routing_address`, `email_routing_catch_all`, `email_routing_rule`, `email_routing_settings` |
| **Firewall (Deprecated)** | `filter`, `firewall_rule`, `rate_limit`, `user_agent_blocking_rule`, `zone_lockdown` |
| **Magic WAN** | `magic_wan_gre_tunnel`, `magic_wan_ipsec_tunnel`, `magic_wan_static_route` |
| **SSL/TLS** | `total_tls` |
| **Waiting Room** | `waiting_room`, `waiting_room_event`, `waiting_room_rules`, `waiting_room_settings` |
| **Web3** | `web3_hostname` |
| **Workers** | `worker_version`, `workers_cron_trigger`, `workers_custom_domain` |
| **Zone Settings** | `zone_cache_variants`, `zone_setting` |
| **Zero Trust** | `zero_trust_access_key_configuration`, `zero_trust_access_short_lived_certificate`, `zero_trust_device_default_profile_certificates`, `zero_trust_dns_location`, `zero_trust_gateway_logging`, `zero_trust_gateway_proxy_endpoint` |

---

### Features

- **zero_trust_access_application**: Add OAuth configuration support with `oauth_configuration` attribute, including dynamic client registration and grant settings

### Bug Fixes

- **client_certificate**: Fix CSR drift with certificate normalization
- **custom_origin_trust_store**: Fix certificate drift with normalization
- **zone_dnssec**: Allow computed fields which will change during refresh

### Documentation

- Added comprehensive [version 5 migration guide](https://github.com/skygenesisenterprise/zenthcloud)
- Deprecated Grit-based migration instructions in the [version 5 upgrade guide](https://github.com/skygenesisenterprise/zenthcloud)
- Updated `tf-migrate` version references to v1.0.0-beta.2

---

## 5.18.0 (2026-03-01)

Full Changelog: [v5.17.0...v5.18.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **access_rule:** support state upgraders for migration ([67fd741](https://github.com/skygenesisenterprise/zenthcloud))
* **api_shield_operation:** state upgrader ([ecd51d4](https://github.com/skygenesisenterprise/zenthcloud))
* **api_token:** state upgrader ([ac5eb62](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_certificate:** v4 to v5 migration ([8d9930d](https://github.com/skygenesisenterprise/zenthcloud))
* **bot_management:** state upgrader ([4d9ee27](https://github.com/skygenesisenterprise/zenthcloud))
* chore: clean up removed endpoint from config ([52f120d](https://github.com/skygenesisenterprise/zenthcloud))
* chore: update zenthcloud-go dependency to `next` ([c92a4cb](https://github.com/skygenesisenterprise/zenthcloud))
* chore: use Go SDK v6.8.0 for release ([b695914](https://github.com/skygenesisenterprise/zenthcloud))
* feat: GIN-1439: Add gateway PAC files ([9de415f](https://github.com/skygenesisenterprise/zenthcloud))
* feat(client_certificate): enable terraform for client_certificates ([58f6a08](https://github.com/skygenesisenterprise/zenthcloud))
* feat(custom_origin_trust_store): enable custom_origin_trust_store ([1c0f313](https://github.com/skygenesisenterprise/zenthcloud))
* feat(stainless): AUTH-7071 Complete Access Users endpoint ([2d4101d](https://github.com/skygenesisenterprise/zenthcloud))
* fix: add 'rdp' as an initialism ([9aa6e67](https://github.com/skygenesisenterprise/zenthcloud))
* **list_item:** state upgrader ([70b70c5](https://github.com/skygenesisenterprise/zenthcloud))
* **list:** state upgrader ([41def2f](https://github.com/skygenesisenterprise/zenthcloud))
* **logpull_retention:** support state upgrader [#6754](https://github.com/skygenesisenterprise/zenthcloud) ([78409e1](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_job:** support state upgrader ([275efd5](https://github.com/skygenesisenterprise/zenthcloud))
* **managed_transforms:** state upgrader ([8de2938](https://github.com/skygenesisenterprise/zenthcloud))
* **notication_policy:** state upgrader ([dbcbda8](https://github.com/skygenesisenterprise/zenthcloud))
* **regional_hostname:** state upgrader ([ed98d9e](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** add new actions for http_response_cache_settings phase ([beeb49e](https://github.com/skygenesisenterprise/zenthcloud))
* **snippet_rules:** use state upgrade ([91a7d1a](https://github.com/skygenesisenterprise/zenthcloud))
* **snippet:** use state upgrade ([dbc8107](https://github.com/skygenesisenterprise/zenthcloud))
* **spectrum_application:** state upgrader ([0957f09](https://github.com/skygenesisenterprise/zenthcloud))
* state upgrader ([bbd68e0](https://github.com/skygenesisenterprise/zenthcloud))
* **url_normalization_settings:** state upgrader ([f933791](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv_namespace:** add state upgrader logic ([695a1e1](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_route:** implement state upgrader ([cef2a35](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** implement state upgrader and move state ([f7e20f8](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** state upgrader ([5427fd9](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_group:** add state upgrader logic and tests ([5d0c09f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_identity_provider:** state upgraders ([c8c88f0](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_mtls_certificate:** state upgraders ([15c5b8e](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_mtls_hostname_settings:** state upgraders ([fe7a900](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_managed_networks:** state upgrader ([0ee822f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** state upgrader ([e4bdf6b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dex_test:** state upgrader ([4b61d73](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** state upgrader ([ca47a4d](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_entries:** feat no-op state upgraders ([808c706](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_predefined_profile:** state upgrader ([71278f0](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_policy:** state upgrader ([cb4ff67](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_list:** implement state upgrader ([5134e5c](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_config:** support state upgrader ([a79e6ea](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_route:** state upgrader ([40289a3](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_dnssec:** add state upgrader logic ([1103393](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_subscription:** add state upgraders for zone_subscription ([3512262](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** add resource state migrations ([049e9a9](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* authenticated_origin_pulls_certificate and authenticated_origin_pulls_hostname_certificate model and schema ([8287f8a](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_ssl:** 'deploy' default removed due to entitlements requirement ([267abd5](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** v5 migration for authenticated_origin_pulls (zone and hostname) ([917dc79](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** v5 migration for authenticated_origin_pulls certs (zone and hostname) ([502766d](https://github.com/skygenesisenterprise/zenthcloud))
* handling case where directory is null ([72f78a7](https://github.com/skygenesisenterprise/zenthcloud))
* **list:** published version ([4f695aa](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer:** improve recurring drift in origins attribute ([248c746](https://github.com/skygenesisenterprise/zenthcloud))
* **migrations:** use local provider for v5 migration tests ([de0b294](https://github.com/skygenesisenterprise/zenthcloud))
* **queue:** migration model ([c9f3274](https://github.com/skygenesisenterprise/zenthcloud))
* revert snippet_rules data source deletion ([f489eb8](https://github.com/skygenesisenterprise/zenthcloud))
* **spectrum_application:** ips are computed optional ([9281cdb](https://github.com/skygenesisenterprise/zenthcloud))
* **spectrum_application:** update 'ips' type and configurability in the model ([f8742f3](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** include the original migration which existed ([10b1b41](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** placement in union schema ([53ee900](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** schema and model after merge conflict? ([892c0d0](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_group:** normalization for include, exclude and require ([ec84aaf](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** model schema parity and gate ([f18d0a8](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** migration model ([dae6782](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** schema model parity ([adda119](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** remove default values from attributes causing drift ([d408f2e](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **api:** update composite API spec ([ff602e7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([e767186](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([81aacfa](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([776c452](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([efbdf3f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([2d79225](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([565a842](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([259a7bd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([deadfa0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([1e91bbe](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d09e587](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([239b2b6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([cc8abe5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([424518f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d444521](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([404b7b2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([9a9324f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([ec1d34e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([1bf0f08](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_pages:** add state upgraders logic ([8feda78](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** update documentation ([968a766](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** update example and doc ([9ea618c](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([d39697f](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([86e94df](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f212c64](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([bbe88b6](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([938118d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([d2b1e8d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([2129377](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([ce10e25](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([4c2f9b0](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0d936f6](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([5b18851](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([02f6d57](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([bd4f014](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([5142372](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([7b6808b](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([2ca23ba](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([285a90d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([4b0cdeb](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([c84470e](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([a992736](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([4ae01ef](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([e37a7e7](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([3553499](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([bba5c6f](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([85859b2](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([90ffea1](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer_monitor:** implement v4-&gt;v5 state migration ([ae47e9c](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer:** implement v4-&gt;v5 state migration ([14fb2e5](https://github.com/skygenesisenterprise/zenthcloud))
* **notification_policy_webhooks:** support state upgrader ([1f223f6](https://github.com/skygenesisenterprise/zenthcloud))
* **queue_consumer:** support state upgraders ([c28386e](https://github.com/skygenesisenterprise/zenthcloud))
* **queue_consumer:** support state upgraders ([67c546d](https://github.com/skygenesisenterprise/zenthcloud))
* **queue:** support state upgraders ([109c401](https://github.com/skygenesisenterprise/zenthcloud))
* **resources:** don't trigger upgrade ([92d92bc](https://github.com/skygenesisenterprise/zenthcloud))
* **snippets:** clean up unused funcs ([c8fdb9a](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** adjust for state upgraders logic ([493975f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_group:** enable cross resource dependent test ([7798310](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** cleanup ([de457ca](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_predefined_profile:** cleanup ([10c57a5](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_subscription:** update test ([8d58520](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** add test cases ([f227117](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* update docs again for v5.18.0 ([6b459d5](https://github.com/skygenesisenterprise/zenthcloud))
* update docs for v5.18.0 ([d98474e](https://github.com/skygenesisenterprise/zenthcloud))


### Refactors

* **zero_trust_access_policy:** match directory structure ([43f639a](https://github.com/skygenesisenterprise/zenthcloud))

## 5.17.0 (2026-02-12)

Full Changelog: [v5.16.0...v5.17.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **account:** add RequiresReplace modifier to unit.id field ([7cbb327](https://github.com/skygenesisenterprise/zenthcloud))
* bump schema verion in prep for state upgraders ([a721535](https://github.com/skygenesisenterprise/zenthcloud))
* bump schema verion in prep for state upgraders ([a721535](https://github.com/skygenesisenterprise/zenthcloud))
* chore: bump zenthcloud-go dependency for TF ([3b4de30](https://github.com/skygenesisenterprise/zenthcloud))
* chore: skip codegen in authenticated_origin_pulls_certificate ([22d11ab](https://github.com/skygenesisenterprise/zenthcloud))
* chore: skip codegen in authenticated_origin_pulls_hostname_certificate ([0fdd92e](https://github.com/skygenesisenterprise/zenthcloud))
* chore: skip codegen in hostnames authenticated_origin_pulls ([82aab9d](https://github.com/skygenesisenterprise/zenthcloud))
* chore: skip codegen in mtls_certificates ([1b14224](https://github.com/skygenesisenterprise/zenthcloud))
* chore: use 'next' branch of Go SDK in Terraform ([809a3f3](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname_fallback_origin:** add comprehensive lifecycle test ([054611a](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname_fallback_origin:** add migration tests and state upgrader logic ([855ef8a](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_hostname_fallback_origin:** add v4 to v5 migration tests ([0542720](https://github.com/skygenesisenterprise/zenthcloud))
* feat(api): RAG-586: enable terraform for AI Search instances and tokens ([fe5239d](https://github.com/skygenesisenterprise/zenthcloud))
* feat(radar): add BGP RPKI ASPA endpoints and fix SDK casings ([e6a03b6](https://github.com/skygenesisenterprise/zenthcloud))
* fix: authenticated_origin_pulls_settings missing id configuration ([abe9087](https://github.com/skygenesisenterprise/zenthcloud))
* fix(total_tls): use upsert pattern for singleton zone setting ([1a79609](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credential_check:** add import functionality. add tests for import ([76e44f0](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** use state upgraders ([db96be7](https://github.com/skygenesisenterprise/zenthcloud))
* refactor(terraform): restructure origin_tls_client_auth to peer subresources ([6c12fea](https://github.com/skygenesisenterprise/zenthcloud))
* state upgrader ([deee33f](https://github.com/skygenesisenterprise/zenthcloud))
* state upgrader ([d8e4529](https://github.com/skygenesisenterprise/zenthcloud))
* tiered caching state upgrader ([d9d2c74](https://github.com/skygenesisenterprise/zenthcloud))
* tiered caching state upgrader ([d9d2c74](https://github.com/skygenesisenterprise/zenthcloud))
* **tiered_cache:** use state upgraders ([8cb061c](https://github.com/skygenesisenterprise/zenthcloud))
* **turstile_widget:** add v4 to v5 migration tests ([a1e27af](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** add migration test ([1032e4e](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account:** map managed_by.parent_org_id to unid.id in unmarshall and add acctests ([a282d8e](https://github.com/skygenesisenterprise/zenthcloud))
* address PR review comments ([62598d7](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_certificate:** add certificate normalization to prevent drift ([9fa8e39](https://github.com/skygenesisenterprise/zenthcloud))
* authenticated_origin_pulls_hostname_certificate resource and tests ([3380cf9](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls:** handle array response and implement full lifecycle ([e4c82b8](https://github.com/skygenesisenterprise/zenthcloud))
* **byo_ip_prefix:** skip LOA tests ([892bce0](https://github.com/skygenesisenterprise/zenthcloud))
* **changelog:** update changelog to reflect reality ([519c85e](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_device_posture_rule:** update tests to match API ([b2aad0d](https://github.com/skygenesisenterprise/zenthcloud))
* mtls_certificates resource and test ([fc44f27](https://github.com/skygenesisenterprise/zenthcloud))
* prevent unnecessary diffs on consecutive applies for hyperdrive_config ([8755bf9](https://github.com/skygenesisenterprise/zenthcloud))
* skip tests requiring account creation ([f6d48e9](https://github.com/skygenesisenterprise/zenthcloud))
* upgrade scenario ([e3831be](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add support for placement mode/status ([1bc17fa](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** schema and migration model ([a9a0e05](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** update v4 version on migration tests ([45a825e](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_organization:** fix plan issues ([f6a9369](https://github.com/skygenesisenterprise/zenthcloud))


### Reverts

* **pages_project:** "fix(pages_project) build_config to computed optional" ([b9c13c9](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* add CODEOWNERS ([3abbb08](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([febe2db](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([71cb6a6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([6c428d6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([eda1841](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([7cda136](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([935193b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([7e45f8d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([e42ae97](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([48153bd](https://github.com/skygenesisenterprise/zenthcloud))
* fix model/schema parity ([b00bd10](https://github.com/skygenesisenterprise/zenthcloud))
* improve contribution guide ([85584b7](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([22b09ad](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f587465](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0bca406](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([3ca7e23](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([02605c2](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([366fb6d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f55e1be](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([33bc656](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([6eb4afc](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([636b4f8](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([067536c](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([1af8451](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f36071f](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([246ffcd](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([471df29](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0211418](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([2bcbbd5](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([09f9d99](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** fix sdk ([be5dbc6](https://github.com/skygenesisenterprise/zenthcloud))
* minimum upgrade test ([25504d0](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** no more state file ([f439772](https://github.com/skygenesisenterprise/zenthcloud))
* Update CHANGELOG.md ([f4a1b58](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* clarify certificate normalization issue in test comments ([8bddab1](https://github.com/skygenesisenterprise/zenthcloud))
* regerate docs ([fc702d9](https://github.com/skygenesisenterprise/zenthcloud))


### Refactors

* refactor stateupgraders ([c950153](https://github.com/skygenesisenterprise/zenthcloud))

## 5.17.0 (2026-02-12)

Full Changelog: [v5.16.0...v5.17.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **ai_search_instance:** add data source for querying AI search instances
* **ai_search_token:** add data source for querying AI search tokens
* **account:** add support for tenant unit management with new `unit` field
* **account:** add automatic mapping from `managed_by.parent_org_id` to `unit.id`
* **account:** deprecate `type` field in favor of computed value
* **authenticated_origin_pulls_certificate:** add data source for querying authenticated origin pull certificates
* **authenticated_origin_pulls_hostname_certificate:** add data source for querying hostname-specific authenticated origin pull certificates
* **authenticated_origin_pulls_settings:** add data source for querying authenticated origin pull settings
* **workers_kv:** add `value` field to data source to retrieve KV values directly
* **workers_script:** add `script` field to data source to retrieve script content
* **workers_script:** add support for `simple` rate limit binding
* **workers_script:** add support for targeted placement mode with `placement.target` array for specifying placement targets (region, hostname, host)
* **workers_script:** add `placement_mode` and `placement_status` computed fields
* **zero_trust_dex_test:** add data source with filter support for finding specific tests
* **zero_trust_dlp_predefined_profile:** add `enabled_entries` field for flexible entry management

### Bug Fixes

* **cloudforce_one_request_message:** use correct `request_id` field instead of `id` in API calls
* **dns_zone_transfers_incoming:** use correct `zone_id` field instead of `id` in API calls
* **dns_zone_transfers_outgoing:** use correct `zone_id` field instead of `id` in API calls
* **email_routing_settings:** use correct `zone_id` field instead of `id` in API calls
* **hyperdrive_config:** add proper handling for write-only fields to prevent state drift
* **hyperdrive_config:** add normalization for empty `mtls` objects to prevent unnecessary diffs
* **magic_network_monitoring_rule:** use correct `account_id` field instead of `id` in API calls
* **stream_key:** use correct `account_id` field instead of `id` in API calls
* **waiting_room_rules:** use correct `waiting_room_id` field instead of `id` in API calls
* **zero_trust_dlp_integration_entry:** use correct `entry_id` field instead of `id` in API calls
* **zero_trust_dlp_predefined_entry:** use correct `entry_id` field instead of `id` in API calls

### Chores

* add state upgraders to 95+ resources for smooth upgrades from v5.16.0
* **certificate_pack:** add state migration handler for SDKv2 to Framework conversion
* **dns_record:** add state migration handler for SDKv2 to Framework conversion
* **load_balancer_pool:** add state migration handler with detection for v4 vs v5 format
* **pages_project:** add state migration handler for SDKv2 to Framework conversion
* **zero_trust_dlp_predefined_profile:** deprecate `entries` field in favor of `enabled_entries`

## 5.16.0 (2026-01-20)

Full Changelog: [v5.15.0...v5.16.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **custom_pages:** add "waf_challenge" as new supported error page type identifier in both resource and data source schemas
* **list:** enhance CIDR validator to check for normalized CIDR notation requiring network address for IPv4 and IPv6
* **magic_wan_gre_tunnel:** add automatic_return_routing attribute for automatic routing control
* **magic_wan_gre_tunnel:** add BGP configuration support with new BGP model attribute
* **magic_wan_gre_tunnel:** add bgp_status computed attribute for BGP connection status information
* **magic_wan_gre_tunnel:** enhance schema with BGP-related attributes and validators
* **magic_wan_ipsec_tunnel:** add automatic_return_routing attribute for automatic routing control
* **magic_wan_ipsec_tunnel:** add BGP configuration support with new BGP model attribute
* **magic_wan_ipsec_tunnel:** add bgp_status computed attribute for BGP connection status information
* **magic_wan_ipsec_tunnel:** add custom_remote_identities attribute for custom identity configuration
* **magic_wan_ipsec_tunnel:** enhance schema with BGP and identity-related attributes
* **ruleset:** add request body buffering support
* **ruleset:** enhance ruleset data source with additional configuration options
* **workers_script:** add observability logs attributes to list data source model
* **workers_script:** enhance list data source schema with additional configuration options

### Bug Fixes

* **dns_record:** remove unnecessary fmt.Sprintf wrapper around LoadTestCase call in test configuration helper function
* **load_balancer:** fix session_affinity_ttl type expectations to match Float64 in initial creation and Int64 after migration
* **workers_kv:** handle special characters correctly in URL encoding

### Documentation

* **account_subscription:** update schema description for rate_plan.sets attribute to clarify it returns an array of strings
* **api_shield:** add resource-level description for API Shield management of auth ID characteristics
* **api_shield:** enhance auth_id_characteristics.name attribute description to include JWT token configuration format requirements
* **api_shield:** specify JSONPath expression format for JWT claim locations
* **hyperdrive_config:** add description attribute to name attribute explaining its purpose in dashboard and API identification
* **hyperdrive_config:** apply description improvements across resource, data source, and list data source schemas
* **hyperdrive_config:** improve schema descriptions for cache settings to clarify default values
* **hyperdrive_config:** update port description to clarify defaults for different database types

## 5.15.0 (2025-12-19)

Full Changelog: [v5.14.0...v5.15.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **ai_search:** add AI Search endpoints ([6f02adb](https://github.com/skygenesisenterprise/zenthcloud))
* **certificate_pack:** add terraform config for CRUD support. This ensures proper Terraform resource ID handling for path parameters in API calls. ([081f32a](https://github.com/skygenesisenterprise/zenthcloud))
* **leaked_credentials_check:** Add GET endpoint for leaked_credentials_check/detections ([feafd9c](https://github.com/skygenesisenterprise/zenthcloud))
* **worker_version:** support `startup_time_ms` ([286ab55](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_group:** v4 to v5 migration acceptance tests ([9c877c7](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_mtls_hostname_settings:** use v2 migrator ([b14aa6d](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_entry:** support `upload_status` ([7dc0fe3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_entry:** support `upload_status` ([7dc0fe3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_integration_entry:** support `upload_status` ([7dc0fe3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_predefined_entry:** support `upload_status` ([7dc0fe3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_policy:** support `forensic_copy` ([5741fd0](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_list:** support additional types (category, location, device) ([5741fd0](https://github.com/skygenesisenterprise/zenthcloud))

### Bug Fixes

* **access_rules:** Add validation to prevent state drift. Ideally we'd use Semantic Equality but since that isn't an option, this will remove a foot-gun. ([4457791](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_pages_project:** addressing drift issues ([6edffcf](https://github.com/skygenesisenterprise/zenthcloud)) ([3db318e](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_worker:** can be cleanly imported ([4859b52](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_worker:** ensure clean imports ([5b525bc](https://github.com/skygenesisenterprise/zenthcloud))
* **list_items:** Add validation for IP List items to avoid inconsistent state ([b6733dc](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** remove all conditions from sweeper ([3197f1a](https://github.com/skygenesisenterprise/zenthcloud))
* map missing fields during spectrum resource import ([#6495](https://github.com/skygenesisenterprise/zenthcloud)) ([ddb4e72](https://github.com/skygenesisenterprise/zenthcloud))
* update invalid codegen ([d365b98](https://github.com/skygenesisenterprise/zenthcloud)) ([92f5c9e](https://github.com/skygenesisenterprise/zenthcloud))

### Chores

* **certificate_pack:** `hosts` is now a set, not a list ([286ab55](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** split acceptance tests into 37 parallel groups for faster ([8c6212b](https://github.com/skygenesisenterprise/zenthcloud))
* **healthcheck:** add test for expected_body default value ([c5afb48](https://github.com/skygenesisenterprise/zenthcloud)) ([e99b43f](https://github.com/skygenesisenterprise/zenthcloud))
* **magic_wan_ipsec_tunnel:** remove `custom_remote_entities` ([286ab55](https://github.com/skygenesisenterprise/zenthcloud))
* **queue_consumer:** Test data fixes for queue consumer acceptance tests ([1b92700](https://github.com/skygenesisenterprise/zenthcloud))
* update go to point to next ([25d640a](https://github.com/skygenesisenterprise/zenthcloud))
* update regional hostnames migration test to use new migrator ([d5ac65f](https://github.com/skygenesisenterprise/zenthcloud))
* update test to use new migrator ([d5ac65f](https://github.com/skygenesisenterprise/zenthcloud)) ([ec875bb](https://github.com/skygenesisenterprise/zenthcloud))

### Documentation

* Deprecate API Shield Schema Validation resources ([366e1b8](https://github.com/skygenesisenterprise/zenthcloud))
* generate provider docs ([c23342e](https://github.com/skygenesisenterprise/zenthcloud))


### Refactors

* **healthcheck:** consolidate tests and expand update coverage ([b747d21](https://github.com/skygenesisenterprise/zenthcloud)) ([7fa38b3](https://github.com/skygenesisenterprise/zenthcloud))

## 5.14.0 (2025-12-06)

Full Changelog: [v5.13.0...v5.14.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add v4-&gt;v5 migration tests for pages_project and adjust schema ([#6506](https://github.com/skygenesisenterprise/zenthcloud)) ([6de0179](https://github.com/skygenesisenterprise/zenthcloud))
* chore: point Terraform to Go 'next' ([af9a5f8](https://github.com/skygenesisenterprise/zenthcloud))
* chore: update go sdk to v6.4.0 for provider release ([63cb021](https://github.com/skygenesisenterprise/zenthcloud))
* chore(api_shield_discovery_operation): Deprecate api_shield_discovery_operation ([7dc0a63](https://github.com/skygenesisenterprise/zenthcloud))
* feat: BOTS-7562 add bot management feedback endpoints to stainless config (prod) ([f5112e1](https://github.com/skygenesisenterprise/zenthcloud))
* feat(r2_data_catalog): Configure SDKs/Terraform to use R2 Data Catalog routes ([5beb50b](https://github.com/skygenesisenterprise/zenthcloud))
* feat(radar): Add origins endpoints to public api docs ([ee51e5f](https://github.com/skygenesisenterprise/zenthcloud))
* improve and standardize sweepers ([#6501](https://github.com/skygenesisenterprise/zenthcloud)) ([03fb2d2](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account_members:** making member policies a set ([#6488](https://github.com/skygenesisenterprise/zenthcloud)) ([f3ecaa5](https://github.com/skygenesisenterprise/zenthcloud))
* decoder and tests ([#6516](https://github.com/skygenesisenterprise/zenthcloud)) ([4c3e2db](https://github.com/skygenesisenterprise/zenthcloud))
* decoder, build ([#6514](https://github.com/skygenesisenterprise/zenthcloud)) ([1935459](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** non empty refresh plans ([#6515](https://github.com/skygenesisenterprise/zenthcloud)) ([bc526ff](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** use correct field name in test sweeper ([6dc0e53](https://github.com/skygenesisenterprise/zenthcloud))
* r2 sweeper ([#6512](https://github.com/skygenesisenterprise/zenthcloud)) ([fec953c](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** resolve SDK v6 migration test failures ([#6507](https://github.com/skygenesisenterprise/zenthcloud)) ([bad9716](https://github.com/skygenesisenterprise/zenthcloud))
* update import signature to accept account_id/subscription_id in order to import account subscription ([#6510](https://github.com/skygenesisenterprise/zenthcloud)) ([c2db582](https://github.com/skygenesisenterprise/zenthcloud))
* **utils:** test assertions ([4c3e2db](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** ignore value import state verify ([#6521](https://github.com/skygenesisenterprise/zenthcloud)) ([c3e3f89](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** No longer treating the migrations attribute as WriteOnly ([#6489](https://github.com/skygenesisenterprise/zenthcloud)) ([dc60e38](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** resource drift when worker has unmanaged secret ([#6504](https://github.com/skygenesisenterprise/zenthcloud)) ([505c0fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** preserve input.version and other fields ([#6500](https://github.com/skygenesisenterprise/zenthcloud)) ([4c4e54b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** preserve input.version and other fields ([#6503](https://github.com/skygenesisenterprise/zenthcloud)) ([d45be9a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** add sweepers for dlp_custom_profile ([cbcb325](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_subscription|account_subscription:** add partners_ent as valid enum for rate_plan.id ([#6505](https://github.com/skygenesisenterprise/zenthcloud)) ([2a70fb4](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** datasource model schema parity ([#6487](https://github.com/skygenesisenterprise/zenthcloud)) ([861c68f](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **account_member:** dont run acceptance with env variable ([4c3e2db](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** fix check for env var ([#6517](https://github.com/skygenesisenterprise/zenthcloud)) ([07e9aa5](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** skip until user is dsr enabled ([#6522](https://github.com/skygenesisenterprise/zenthcloud)) ([dd7c2fe](https://github.com/skygenesisenterprise/zenthcloud))
* **account_tokens:** adding a simple CRUD test ([#6484](https://github.com/skygenesisenterprise/zenthcloud)) ([6869538](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([71fc050](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([68d017a](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_api_shield_operation:** Add acceptance tests  ([#6491](https://github.com/skygenesisenterprise/zenthcloud)) ([37e1fdf](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** update documentation ([#6523](https://github.com/skygenesisenterprise/zenthcloud)) ([a060e61](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([923ea1d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([a110cbe](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([7b36c06](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([c789f91](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([a91faa6](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([dfa745a](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([fb3ef1b](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([504e8b6](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([550d77c](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_job:** add v4 to v5 migration tests ([#6483](https://github.com/skygenesisenterprise/zenthcloud)) ([2e4b8a0](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** cloud connector rules parity tests and add connectivity_directory_service tests ([#6513](https://github.com/skygenesisenterprise/zenthcloud)) ([5341c82](https://github.com/skygenesisenterprise/zenthcloud))
* update changelog ([#6480](https://github.com/skygenesisenterprise/zenthcloud)) ([adba156](https://github.com/skygenesisenterprise/zenthcloud))
* update changelog ([#6525](https://github.com/skygenesisenterprise/zenthcloud)) ([b026b4d](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile_local_domain_fallback:** add tests ([#6464](https://github.com/skygenesisenterprise/zenthcloud)) ([365cb71](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default|custom_profile:** acceptance test coverage ([#6511](https://github.com/skygenesisenterprise/zenthcloud)) ([8e4ec1a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_managed_networks:** add tests ([#6463](https://github.com/skygenesisenterprise/zenthcloud)) ([e9b6783](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_integration:** update tests for to test with Crowdstrike ([#6470](https://github.com/skygenesisenterprise/zenthcloud)) ([e360d6f](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** update migration tests ([#6468](https://github.com/skygenesisenterprise/zenthcloud)) ([8ff53df](https://github.com/skygenesisenterprise/zenthcloud))

## 5.14.0 (2025-12-05)

Full Changelog: [v5.13.0...v5.14.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add v4-&gt;v5 migration tests for pages_project and adjust schema ([#6506](https://github.com/skygenesisenterprise/zenthcloud)) ([6de0179](https://github.com/skygenesisenterprise/zenthcloud))
* chore(api_shield_discovery_operation): Deprecate api_shield_discovery_operation ([7dc0a63](https://github.com/skygenesisenterprise/zenthcloud))
* feat(bot_management): add bot management feedback endpoints to stainless config (prod) ([f5112e1](https://github.com/skygenesisenterprise/zenthcloud))
* feat(r2_data_catalog): Configure SDKs/Terraform to use R2 Data Catalog routes ([5beb50b](https://github.com/skygenesisenterprise/zenthcloud))
* feat(radar): Add origins endpoints to public api docs ([ee51e5f](https://github.com/skygenesisenterprise/zenthcloud))
* improve and standardize sweepers ([#6501](https://github.com/skygenesisenterprise/zenthcloud)) ([03fb2d2](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account_members:** making member policies a set ([#6488](https://github.com/skygenesisenterprise/zenthcloud)) ([f3ecaa5](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** non empty refresh plans ([#6515](https://github.com/skygenesisenterprise/zenthcloud)) ([bc526ff](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** use correct field name in test sweeper ([6dc0e53](https://github.com/skygenesisenterprise/zenthcloud))
* **r2** sweeper ([#6512](https://github.com/skygenesisenterprise/zenthcloud)) ([fec953c](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** resolve SDK v6 migration test failures ([#6507](https://github.com/skygenesisenterprise/zenthcloud)) ([bad9716](https://github.com/skygenesisenterprise/zenthcloud))
* **utils:** test assertions ([4c3e2db](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** ignore value import state verify ([#6521](https://github.com/skygenesisenterprise/zenthcloud)) ([c3e3f89](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** No longer treating the migrations attribute as WriteOnly ([#6489](https://github.com/skygenesisenterprise/zenthcloud)) ([dc60e38](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** resource drift when worker has unmanaged secret ([#6504](https://github.com/skygenesisenterprise/zenthcloud)) ([505c0fe](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** preserve input.version and other fields ([#6500](https://github.com/skygenesisenterprise/zenthcloud)) ([4c4e54b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** preserve input.version and other fields ([#6503](https://github.com/skygenesisenterprise/zenthcloud)) ([d45be9a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** add sweepers for dlp_custom_profile ([cbcb325](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_subscription|account_subscription:** add partners_ent as valid enum for rate_plan.id ([#6505](https://github.com/skygenesisenterprise/zenthcloud)) ([2a70fb4](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** datasource model schema parity ([#6487](https://github.com/skygenesisenterprise/zenthcloud)) ([861c68f](https://github.com/skygenesisenterprise/zenthcloud))
* update import signature to accept account_id/subscription_id in order to import account subscription ([#6510](https://github.com/skygenesisenterprise/zenthcloud)) ([c2db582](https://github.com/skygenesisenterprise/zenthcloud))
* json decoder and tests ([#6516](https://github.com/skygenesisenterprise/zenthcloud)) ([4c3e2db](https://github.com/skygenesisenterprise/zenthcloud))


### Chores
* **api_shield_discovery_operation:** Deprecate api_shield_discovery_operation ([7dc0a63](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** dont run acceptance with env variable ([4c3e2db](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** fix check for env var ([#6517](https://github.com/skygenesisenterprise/zenthcloud)) ([07e9aa5](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** skip until user is dsr enabled ([#6522](https://github.com/skygenesisenterprise/zenthcloud)) ([dd7c2fe](https://github.com/skygenesisenterprise/zenthcloud))
* **account_tokens:** adding a simple CRUD test ([#6484](https://github.com/skygenesisenterprise/zenthcloud)) ([6869538](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_entry:** add `profiles` attribute to DLP entry resources ([71fc050](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket_sippy:** add S3-compatible provider support with `bucket_url` attribute ([71fc050](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** add `source` config block for granular source control settings ([68d017a](https://github.com/skygenesisenterprise/zenthcloud))
* **certificate_pack:** add `certificates` and `primary_certificate` attributes ([68d017a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_rule:** add `antivirus` posture rule type ([68d017a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_settings:** add external emergency signal configuration attributes ([68d017a](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_api_shield_operation:** add acceptance tests ([#6491](https://github.com/skygenesisenterprise/zenthcloud)) ([37e1fdf](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_job:** add v4 to v5 migration tests ([#6483](https://github.com/skygenesisenterprise/zenthcloud)) ([2e4b8a0](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** cloud connector rules parity tests and add connectivity_directory_service tests ([#6513](https://github.com/skygenesisenterprise/zenthcloud)) ([5341c82](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default_profile_local_domain_fallback:** add tests ([#6464](https://github.com/skygenesisenterprise/zenthcloud)) ([365cb71](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_default|custom_profile:** acceptance test coverage ([#6511](https://github.com/skygenesisenterprise/zenthcloud)) ([8e4ec1a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_managed_networks:** add tests ([#6463](https://github.com/skygenesisenterprise/zenthcloud)) ([e9b6783](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_posture_integration:** update tests for to test with Crowdstrike ([#6470](https://github.com/skygenesisenterprise/zenthcloud)) ([e360d6f](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** update migration tests ([#6468](https://github.com/skygenesisenterprise/zenthcloud)) ([8ff53df](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** update zenthcloud-go SDK dependency ([923ea1d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** update zenthcloud-go SDK dependency ([a110cbe](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** update zenthcloud-go SDK dependency ([7b36c06](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** improve JSON decoder to handle multiple fields with same name ([c789f91](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** update zenthcloud-go SDK dependency ([a91faa6](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** update zenthcloud-go SDK dependency ([dfa745a](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** add example files for email security resources ([fb3ef1b](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** update zenthcloud-go SDK dependency ([504e8b6](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** update zenthcloud-go SDK dependency ([550d77c](https://github.com/skygenesisenterprise/zenthcloud))

### Deprecations
* **api_shield_discovery_operation**

## 5.13.0 (2025-11-21)

Full Changelog: [v5.12.0...v5.13.0](https://github.com/skygenesisenterprise/zenthcloud)

### ⚠ BREAKING CHANGES: zenthcloud_api_token & zenthcloud_account_token Schema Update

The 5.13 release includes major updates to the zenthcloud_api_token resource to eliminate configuration drift caused by policy ordering differences in the Zenthcloud API.

Fixes: zenthcloud/terraform-provider-zenthcloud#6092

**Whats changed**
- policies are now a Set; order is ignored to prevent drift.
- When defining a policy, resources must use jsonencode(); all policy resource values must now be JSON-encoded strings.
- Removed fields: id, name, and meta have been removed from policy blocks.

**Required Action (v5.13+)**
Customers looking to upgrade to v5.13+ must update all zenthcloud_api_token & zenthcloud_account_token resources to wrap policy resource values in jsonencode()

Before:
```
resources = {
  "com.zenthcloud.api.account.${var.cf_account_id}" = "*"
}
```
After:
```
resources = jsonencode({
  "com.zenthcloud.api.account.${var.cf_account_id}" = "*"
})
```

* **account_token:** token policy order and nested resources ([#6440](https://github.com/skygenesisenterprise/zenthcloud))

### Features

* add new resources and data sources ([7ce3dec](https://github.com/skygenesisenterprise/zenthcloud))
* **api_token+account_tokens:** state upgrader and schema bump ([#6472](https://github.com/skygenesisenterprise/zenthcloud)) ([42f7db2](https://github.com/skygenesisenterprise/zenthcloud))
* chore(build): point Terraform to released Go v6.3.0 ([6d06b46](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** make docs explicit when a resource does not have import support ([02699f6](https://github.com/skygenesisenterprise/zenthcloud))
* **magic_transit_connector:** support self-serve license key ([#6398](https://github.com/skygenesisenterprise/zenthcloud)) ([a6ec134](https://github.com/skygenesisenterprise/zenthcloud))
* **worker_version:** add content_base64 support ([6ff643f](https://github.com/skygenesisenterprise/zenthcloud))
* **worker_version:** boolean support for run_worker_first ([#6407](https://github.com/skygenesisenterprise/zenthcloud)) ([116a67b](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script_subdomains:** add import support  ([#6375](https://github.com/skygenesisenterprise/zenthcloud)) ([40f7ed8](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** add proxy_endpoint for ZT Access Application ([#6453](https://github.com/skygenesisenterprise/zenthcloud)) ([177f20a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_predefined_profile:** Switch DLP Predefined Profile endpoints, introduce enabled_entries attribute ([bc69569](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd:** v4 to v5 migration tests ([#6461](https://github.com/skygenesisenterprise/zenthcloud)) ([ffa0fef](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account_token:** token policy order and nested resources ([#6440](https://github.com/skygenesisenterprise/zenthcloud)) ([86c5972](https://github.com/skygenesisenterprise/zenthcloud))
* allow r2_bucket_event_notification to be applied twice without failing ([#6419](https://github.com/skygenesisenterprise/zenthcloud)) ([6fbd4c5](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_worker+zenthcloud_worker_version:** import for the resources ([#6357](https://github.com/skygenesisenterprise/zenthcloud)) ([b98e0be](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** inconsistent apply error ([#6452](https://github.com/skygenesisenterprise/zenthcloud)) ([f289994](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_domain:** resource tests ([#6338](https://github.com/skygenesisenterprise/zenthcloud)) ([d769e29](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** unintended resource state drift ([#6377](https://github.com/skygenesisenterprise/zenthcloud)) ([1a3955a](https://github.com/skygenesisenterprise/zenthcloud))
* **queue_consumer:** id population ([#6181](https://github.com/skygenesisenterprise/zenthcloud)) ([f3c6498](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** multipart request  ([#6367](https://github.com/skygenesisenterprise/zenthcloud)) ([65f8c19](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** updating workers metadata attribute to be read from endpoint ([#6386](https://github.com/skygenesisenterprise/zenthcloud)) ([3a35757](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script_subdomain:** add note to zenthcloud_workers_script_subdomain about redundancy with zenthcloud_worker ([#6383](https://github.com/skygenesisenterprise/zenthcloud)) ([9cc9b59](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** allow config.run_worker_first to accept list input ([fab567c](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile_local_domain_fallback:** drift issues ([#6365](https://github.com/skygenesisenterprise/zenthcloud)) ([65c0c18](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile:** resolve drift issues ([#6364](https://github.com/skygenesisenterprise/zenthcloud)) ([4cd2cbd](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dex_test:** correct configurability for 'targeted' attribute to fix drift ([cd81178](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_config:** remove warp_routing from zenthcloudd_config ([#6471](https://github.com/skygenesisenterprise/zenthcloud)) ([dc9d557](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **account_member:** add migration test ([#6425](https://github.com/skygenesisenterprise/zenthcloud)) ([967a972](https://github.com/skygenesisenterprise/zenthcloud))
* **byoip:** integrate generated changes for BYOIP resources ([432160e](https://github.com/skygenesisenterprise/zenthcloud))
* **certificate_pack:** docs show safe rotation instructions ([#6388](https://github.com/skygenesisenterprise/zenthcloud)) ([3d37264](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** clean up leftover files in resources ([#6474](https://github.com/skygenesisenterprise/zenthcloud)) ([e8aee72](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** drop migration tests from CI ([#6476](https://github.com/skygenesisenterprise/zenthcloud)) ([968565f](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** fix tests ran on release PR ([#6478](https://github.com/skygenesisenterprise/zenthcloud)) ([0b43c46](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** fixes for parity tests and build failures ([#6475](https://github.com/skygenesisenterprise/zenthcloud)) ([3561876](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** modify sweepers ([#6479](https://github.com/skygenesisenterprise/zenthcloud)) ([4c8915d](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** skip flaky test in CI ([fb14d86](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_zero_trust_dlp_custom_profile:** migration test and ignore order as set ([#6428](https://github.com/skygenesisenterprise/zenthcloud)) ([1659ff3](https://github.com/skygenesisenterprise/zenthcloud))
* **d1:** integrate generated changes for D1 resources ([cfa3472](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** improve dns sweepers ([#6430](https://github.com/skygenesisenterprise/zenthcloud)) ([5e62468](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** document configurations and examples ([#6449](https://github.com/skygenesisenterprise/zenthcloud)) ([59430e0](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** generate docs and examples ([cdd77ec](https://github.com/skygenesisenterprise/zenthcloud))
* **email_routing:** improved email routing sweepers ([#6429](https://github.com/skygenesisenterprise/zenthcloud)) ([133c81e](https://github.com/skygenesisenterprise/zenthcloud))
* **iam:** integrate generated changes for IAM resources ([a87806e](https://github.com/skygenesisenterprise/zenthcloud))
* include new sections for pr template ([#6395](https://github.com/skygenesisenterprise/zenthcloud)) ([81c07e1](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancing:** integrate generated changes for Load Balancing resources ([4c6b34d](https://github.com/skygenesisenterprise/zenthcloud))
* **logpull_retention:** add migration test for ([#6426](https://github.com/skygenesisenterprise/zenthcloud)) ([529f313](https://github.com/skygenesisenterprise/zenthcloud))
* **logpull_retention:** update acceptance test ([#6277](https://github.com/skygenesisenterprise/zenthcloud)) ([3766b3f](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_job:** add import tests for resource ([#6402](https://github.com/skygenesisenterprise/zenthcloud)) ([cded8ec](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush:** integrate generated changes for Logpush resources ([06e8446](https://github.com/skygenesisenterprise/zenthcloud))
* **notification_policy_webhook:** add migration test for notification-policy-webhook ([#6443](https://github.com/skygenesisenterprise/zenthcloud)) ([742d647](https://github.com/skygenesisenterprise/zenthcloud))
* **pages:** integrate generated changes for Pages resources ([64855ea](https://github.com/skygenesisenterprise/zenthcloud))
* **queue_consumer:** testdata refactor ([d301974](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket:** v4 to v5 migration tests for zenthcloud_r2_bucket ([#6437](https://github.com/skygenesisenterprise/zenthcloud)) ([99ed1ee](https://github.com/skygenesisenterprise/zenthcloud))
* **sso_connector:** add acceptance tests ([#6427](https://github.com/skygenesisenterprise/zenthcloud)) ([8b54303](https://github.com/skygenesisenterprise/zenthcloud))
* **stainless:** integrate changes from unpinned codegen version ([9cb3b8e](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** acceptance tests for token validation resources ([#6417](https://github.com/skygenesisenterprise/zenthcloud)) ([4d94bdd](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** add schema and token validation acceptance tests to CI ([#6421](https://github.com/skygenesisenterprise/zenthcloud)) ([b805abc](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** increase legacy migrator test coverage ([#6401](https://github.com/skygenesisenterprise/zenthcloud)) ([9a8c48a](https://github.com/skygenesisenterprise/zenthcloud))
* **universal_ssl_setting:** add acceptance tests for universal_ssl_setting ([2601c45](https://github.com/skygenesisenterprise/zenthcloud))
* **worker:** integrate generated changes for Worker resources ([1da2bf2](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv_namespace:** v4 to v5 migration tests for workers_kv_namespace ([#6424](https://github.com/skygenesisenterprise/zenthcloud)) ([433010f](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** v4 to v5 migration tests for workers_kv ([#6435](https://github.com/skygenesisenterprise/zenthcloud)) ([58ca912](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add workers scripts sweeper ([#6351](https://github.com/skygenesisenterprise/zenthcloud)) ([f439a08](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** fix resource name in TestAccZenthcloudWorkerScript_ModuleWithDurableObject ([614d8d3](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** fix resource names in tests ([788e73a](https://github.com/skygenesisenterprise/zenthcloud))
* **workers:** integrate generated changes for Workers resources ([ab0a330](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_service_token:** add migration test for zero_trust_access_service_token ([#6416](https://github.com/skygenesisenterprise/zenthcloud)) ([c77d5d5](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_policy:** v4 to v5 migration for zero_trust_gateway_policy ([#6413](https://github.com/skygenesisenterprise/zenthcloud)) ([1c1952b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_list:** v4 to v5 migration tests for zero trust list records ([#6400](https://github.com/skygenesisenterprise/zenthcloud)) ([6ed55d6](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_route:** v4 to v5 migration tests for zero_trust_tunnel_zenthcloudd_route ([#6409](https://github.com/skygenesisenterprise/zenthcloud)) ([5dc2094](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust, cfone:** integrate generated changes for ZT and CFONE resources ([b7131b2](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_dnssec:** v4 to v5 migration tests for zone_dnssec ([#6432](https://github.com/skygenesisenterprise/zenthcloud)) ([86abd1f](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_settings:** acceptance test to repro issue [#6363](https://github.com/skygenesisenterprise/zenthcloud) ([#6445](https://github.com/skygenesisenterprise/zenthcloud)) ([707c154](https://github.com/skygenesisenterprise/zenthcloud))
* **zones:** data source tests ([#6414](https://github.com/skygenesisenterprise/zenthcloud)) ([4d58e56](https://github.com/skygenesisenterprise/zenthcloud))
* **zt_access:** add sweepers for policy and service token ([#6465](https://github.com/skygenesisenterprise/zenthcloud)) ([9f4fa94](https://github.com/skygenesisenterprise/zenthcloud))

## 5.12.0 (2025-10-30)

Full Changelog: [v5.11.0...v5.12.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* chore: pin zenthcloud-go for provider release ([61a33f9](https://github.com/skygenesisenterprise/zenthcloud))
* chore: use zenthcloud-go@next for the 'next' branch ([8d8ff6d](https://github.com/skygenesisenterprise/zenthcloud))
* chore(abuse): rename path parameter ([cbda07b](https://github.com/skygenesisenterprise/zenthcloud))
* ci: remove zero_trust_connectivity_directory_service ([23bd535](https://github.com/skygenesisenterprise/zenthcloud))
* ci: trigger prod build ([fffdf5a](https://github.com/skygenesisenterprise/zenthcloud))
* feat: add connectivity directory service APIs to openapi.stainless.yml ([1a6b304](https://github.com/skygenesisenterprise/zenthcloud))
* feat: SDKs for Organizations and OrganizationsProfile ([1f6eae3](https://github.com/skygenesisenterprise/zenthcloud))
* feat(api): add mcp portals endpoints ([1e317de](https://github.com/skygenesisenterprise/zenthcloud))
* feat(radar): add new group by dimension endpoints; deprecate to_markdown endpoint ([bcb58cb](https://github.com/skygenesisenterprise/zenthcloud))
* fix(content_scanning): content scanning terraform resource ([03b7004](https://github.com/skygenesisenterprise/zenthcloud))
* fix(workers_domain): treat `PUT /workers/domains` as a create operation ([8ff0c7d](https://github.com/skygenesisenterprise/zenthcloud))
* modernize zero_trust_tunnel_zenthcloudd_config tests and fix warp_routing ([#6294](https://github.com/skygenesisenterprise/zenthcloud)) ([36d38a6](https://github.com/skygenesisenterprise/zenthcloud))
* modernize zero_trust_tunnel_zenthcloudd_virtual_network tests and improve ([#6293](https://github.com/skygenesisenterprise/zenthcloud)) ([1b0f6d6](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_application:** Add support for MCP & MCP_PORTAL ([#6326](https://github.com/skygenesisenterprise/zenthcloud)) ([9524b60](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **account_member:** update policies test by selecting correct resource group ([#6352](https://github.com/skygenesisenterprise/zenthcloud)) ([693dc9d](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_r2_bucket_sippy:** attribute name in example ([#6336](https://github.com/skygenesisenterprise/zenthcloud)) ([208bf81](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_worker_version:** replace when module content_sha256 value changes ([#6335](https://github.com/skygenesisenterprise/zenthcloud)) ([e31395d](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_workers_script:** Update docs note for resource ([#6304](https://github.com/skygenesisenterprise/zenthcloud)) ([f7b4cef](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_workflow:** download dependencies for workflow resource acceptance tests ([#6302](https://github.com/skygenesisenterprise/zenthcloud)) ([84bade9](https://github.com/skygenesisenterprise/zenthcloud))
* correctly detect more ID attributes for data sources ([d5f4e7d](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_pages:** fix broken tests ([#6372](https://github.com/skygenesisenterprise/zenthcloud)) ([95f344e](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_pages:** update type enumerations ([#6369](https://github.com/skygenesisenterprise/zenthcloud)) ([8bd0d09](https://github.com/skygenesisenterprise/zenthcloud))
* enable skipped gateway policy tests and simplify quarantine test ([#6296](https://github.com/skygenesisenterprise/zenthcloud)) ([b220f2b](https://github.com/skygenesisenterprise/zenthcloud))
* ensure model/schema parity across several resources ([#6379](https://github.com/skygenesisenterprise/zenthcloud)) ([418aedd](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero_trust_dex_test tests ([#6301](https://github.com/skygenesisenterprise/zenthcloud)) ([0345a4d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** correctly generate schema according to annotations ([529f0ff](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** add target flag to specify resources ([#6324](https://github.com/skygenesisenterprise/zenthcloud)) ([1b94fcd](https://github.com/skygenesisenterprise/zenthcloud))
* **notification_policy:** address drift due to unordered lists, converted to sets ([#6316](https://github.com/skygenesisenterprise/zenthcloud)) ([7eabe67](https://github.com/skygenesisenterprise/zenthcloud))
* read by id data sources should have required IDs ([1ca9485](https://github.com/skygenesisenterprise/zenthcloud))
* restore missing testdata ([#6378](https://github.com/skygenesisenterprise/zenthcloud)) ([5cb8dc6](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_version:** inconsistent binding order causing inconsistent result after apply ([#6342](https://github.com/skygenesisenterprise/zenthcloud)) ([1de79a4](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_access_service_token:** client secret versioning ([#6328](https://github.com/skygenesisenterprise/zenthcloud)) ([d6b7107](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dex_test:** ensure model/schema parity ([#6370](https://github.com/skygenesisenterprise/zenthcloud)) ([066ae4f](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dex_test:** fix duplicate key, imports ([#6366](https://github.com/skygenesisenterprise/zenthcloud)) ([15c05d0](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** fix read, refresh, import ([#6391](https://github.com/skygenesisenterprise/zenthcloud)) ([3154453](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_virtual_network:** fix sweeper panics ([#6392](https://github.com/skygenesisenterprise/zenthcloud)) ([c190bc7](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **api_shield:** Acceptance tests increase coverage ([#6325](https://github.com/skygenesisenterprise/zenthcloud)) ([3e957c7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([6d91d6b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([a1e1df9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([1b9a680](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([c53a1f5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([ae642c6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([86ea5b7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([5bf96b0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([07f3913](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([f7c9b47](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([1519d61](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([a78ff01](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([fa156c0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([6f4ab90](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([9455823](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([e482a4f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([98e3585](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d552b8c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([46b4930](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([34eddaf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([50139f0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([b151882](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([5892196](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([2ef377f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0f029be](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([5483722](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([19ec88c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([3a0fbe7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0ef1be1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([605134b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d134c57](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0f0b7ff](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([aebfa72](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([a37714a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([e600699](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([938d787](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([8ef0127](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([8ab046d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([37a7311](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([038e76d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([80fc0cd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([ddb3468](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([88b0b8e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([cd64df6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([41b75fb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([3a7c0a5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([9c45892](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([4e791c5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([39816af](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d156eef](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([b2bd81b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([1111340](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([938003c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0b7e283](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([2e958fb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([138735c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([002fd57](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([302fa30](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0294b5e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([ddb7a1c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([4cba4b4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([c88075f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([23b810f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([8590d26](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([2fa0344](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([e01d191](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0b9c36d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([644ff5f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([fd946b1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([5b54f0d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([0421b6a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d0f7eb4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([e8a2650](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d0784b3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([3490350](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([c009139](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([385cc44](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([7dc37da](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([3fc4cf6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([d812ed9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([35aca13](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([f610c3e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([b435318](https://github.com/skygenesisenterprise/zenthcloud))
* fix errors in `zenthcloud_pages_project` acceptance tests ([#6318](https://github.com/skygenesisenterprise/zenthcloud)) ([cb63e28](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([010cc1e](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([fde5364](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([b451331](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([cf23a89](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f577253](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([70652b4](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0504080](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_jobs:** Add tests from basic to full fields, and changes on omitempty field ([#6337](https://github.com/skygenesisenterprise/zenthcloud)) ([696abcd](https://github.com/skygenesisenterprise/zenthcloud))
* **organization_profile:** add org id env variable for acceptance tests ([#6382](https://github.com/skygenesisenterprise/zenthcloud)) ([37468a7](https://github.com/skygenesisenterprise/zenthcloud))
* **organizations and organization_profiles:** Acceptance Tests and wait after create ([#6329](https://github.com/skygenesisenterprise/zenthcloud)) ([ecfd9bf](https://github.com/skygenesisenterprise/zenthcloud))
* **organizations:** wire up acceptance test in CI ([#6349](https://github.com/skygenesisenterprise/zenthcloud)) ([c1cbe9e](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** only sweep pages projects resources created during testing ([#6298](https://github.com/skygenesisenterprise/zenthcloud)) ([1a2daa3](https://github.com/skygenesisenterprise/zenthcloud))
* **pages_project:** update ZENTHCLOUD_PAGES_OWNER and ZENTHCLOUD_PAGES_REPO used for acceptance tests ([#6300](https://github.com/skygenesisenterprise/zenthcloud)) ([939499e](https://github.com/skygenesisenterprise/zenthcloud))
* **queue:** Acceptance tests ([#6339](https://github.com/skygenesisenterprise/zenthcloud)) ([d9eb75d](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket_lock, r2_bucket_lifecycle:** add acceptance tests  ([#6299](https://github.com/skygenesisenterprise/zenthcloud)) ([1fdbd28](https://github.com/skygenesisenterprise/zenthcloud))
* update pr template ([#6359](https://github.com/skygenesisenterprise/zenthcloud)) ([a062c51](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_connectivity_directory_service:** Add wvpc / connectivity directory servic acceptance tests ([#6334](https://github.com/skygenesisenterprise/zenthcloud)) ([63e78d5](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp_custom_profile:** shared_entries acceptance tests ([#6317](https://github.com/skygenesisenterprise/zenthcloud)) ([83cf87b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_network_hostname_route:** Add acceptance tests for Hostname Routes ([#6282](https://github.com/skygenesisenterprise/zenthcloud)) ([0ec769b](https://github.com/skygenesisenterprise/zenthcloud))
* **zerot trust dl resources:** Add acceptance tests for DLP resources (rebased version of !5751) ([#6233](https://github.com/skygenesisenterprise/zenthcloud)) ([cbd0568](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* generate provider documentation ([#6394](https://github.com/skygenesisenterprise/zenthcloud)) ([44843f0](https://github.com/skygenesisenterprise/zenthcloud))
* generate terraform documentation ([#6384](https://github.com/skygenesisenterprise/zenthcloud)) ([6bffa7c](https://github.com/skygenesisenterprise/zenthcloud))

## 5.11.0 (2025-10-02)

Full Changelog: [v5.10.1...v5.11.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add `assets.directory` attribute for handling assets uploads in `zenthcloud_workers_script` and `zenthcloud_worker_version`  resources ([#6160](https://github.com/skygenesisenterprise/zenthcloud)) ([50168e5](https://github.com/skygenesisenterprise/zenthcloud))
* add comprehensive test coverage for zenthcloud_zero_trust_list types and ([#6258](https://github.com/skygenesisenterprise/zenthcloud)) ([6d2746c](https://github.com/skygenesisenterprise/zenthcloud))
* add missing services to CI test runner ([#6271](https://github.com/skygenesisenterprise/zenthcloud)) ([1477df8](https://github.com/skygenesisenterprise/zenthcloud))
* added capability for `dynamicvalidator` to do arbitrary semantic equivalence check ([e1faeb8](https://github.com/skygenesisenterprise/zenthcloud))
* Add custom origin trust store support ([175f4f5](https://github.com/skygenesisenterprise/zenthcloud))
* Add Terraform resource for Workflows ([7533c05](https://github.com/skygenesisenterprise/zenthcloud))
* Add leaked credential check resources ([c6be1c6](https://github.com/skygenesisenterprise/zenthcloud))
* Update worker and access application schemas ([ed096e0](https://github.com/skygenesisenterprise/zenthcloud))
* Adding new self-service SSO APIs ([007bdbc](https://github.com/skygenesisenterprise/zenthcloud))
* Changing SSO update from put to patch ([f67fbd5](https://github.com/skygenesisenterprise/zenthcloud))
* Rename duplicate parameter in the to_markdown subresource ([07ccc50](https://github.com/skygenesisenterprise/zenthcloud))
* Add to_markdown subresource to AI resource ([1a71265](https://github.com/skygenesisenterprise/zenthcloud))

### Bug Fixes

* bugfix for setting JSON keys with special characters ([9a106e3](https://github.com/skygenesisenterprise/zenthcloud))
* **build:** fix broken builds on 'next' ([#6280](https://github.com/skygenesisenterprise/zenthcloud)) ([2224d8a](https://github.com/skygenesisenterprise/zenthcloud))
* **build:** revert cache resources to released state ([#6289](https://github.com/skygenesisenterprise/zenthcloud)) ([e62250c](https://github.com/skygenesisenterprise/zenthcloud))
* case-insensitive location handling for R2 bucket resources ([#6026](https://github.com/skygenesisenterprise/zenthcloud)) ([78c33ff](https://github.com/skygenesisenterprise/zenthcloud))
* zenthcloud_workers_custom_domain failing to update ([#6082](https://github.com/skygenesisenterprise/zenthcloud)) ([46203a3](https://github.com/skygenesisenterprise/zenthcloud))
* fix acceptance tests in CI ([#6286](https://github.com/skygenesisenterprise/zenthcloud)) ([c0a9e89](https://github.com/skygenesisenterprise/zenthcloud))
* Fix zero trust access application acceptance tests ([#6243](https://github.com/skygenesisenterprise/zenthcloud)) ([4a2cbdb](https://github.com/skygenesisenterprise/zenthcloud))
* **list_item:** source url validation ([#6226](https://github.com/skygenesisenterprise/zenthcloud)) ([70abffa](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** concatenate static and dynamic rules blocks ([#6215](https://github.com/skygenesisenterprise/zenthcloud)) ([be571d8](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** page rules status defaults ([#6212](https://github.com/skygenesisenterprise/zenthcloud)) ([42a83d1](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** zt access app default type ([#6218](https://github.com/skygenesisenterprise/zenthcloud)) ([cea98f8](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket:** case-insensitive location comparison and preserve state case in R2 bucket resource ([#6211](https://github.com/skygenesisenterprise/zenthcloud)) ([5babbb1](https://github.com/skygenesisenterprise/zenthcloud))
* resolve compilation and schema parity errors across multiple services ([#6241](https://github.com/skygenesisenterprise/zenthcloud)) ([052cab8](https://github.com/skygenesisenterprise/zenthcloud))
* resolve compilation errors in zero_trust_access_application and workers_script ([#6230](https://github.com/skygenesisenterprise/zenthcloud)) ([2b78333](https://github.com/skygenesisenterprise/zenthcloud))
* resolve provider schema validation errors and R2 bucket test failures ([#6222](https://github.com/skygenesisenterprise/zenthcloud)) ([2df6eb1](https://github.com/skygenesisenterprise/zenthcloud))
* resolve zero trust test failures from computed attribute refresh drift ([#6224](https://github.com/skygenesisenterprise/zenthcloud)) ([5351c6a](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** allow rewrite rules to set an empty URL query string ([#6256](https://github.com/skygenesisenterprise/zenthcloud)) ([b177cc0](https://github.com/skygenesisenterprise/zenthcloud))
* workers script migration ([#6210](https://github.com/skygenesisenterprise/zenthcloud)) ([dca249e](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* add easy sweeper script ([#6220](https://github.com/skygenesisenterprise/zenthcloud)) ([7fe36e5](https://github.com/skygenesisenterprise/zenthcloud))
* do not install brew dependencies in ./scripts/bootstrap by default ([44f11c3](https://github.com/skygenesisenterprise/zenthcloud))
* ensure `tfplugindocs` always use `/var/tmp` for compilation on linux ([3ccb727](https://github.com/skygenesisenterprise/zenthcloud))
* improve example values ([1ac2c1e](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush_jobs:** Switch to Plan and State Checks from legacy Checks for logpush_jobs resource ([#6083](https://github.com/skygenesisenterprise/zenthcloud)) ([5933a83](https://github.com/skygenesisenterprise/zenthcloud))
* **mcp:** allow pointing `docs_search` tool at other URLs ([195dbf4](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** remove debug statements from migration tool ([#6223](https://github.com/skygenesisenterprise/zenthcloud)) ([b50ee7c](https://github.com/skygenesisenterprise/zenthcloud))
* run migration tests with sweepers ([#6209](https://github.com/skygenesisenterprise/zenthcloud)) ([489795d](https://github.com/skygenesisenterprise/zenthcloud))
* run workers_kv and regional_hostname tests in CI ([#6240](https://github.com/skygenesisenterprise/zenthcloud)) ([5433d6b](https://github.com/skygenesisenterprise/zenthcloud))
* skip mtls migration test ([#6207](https://github.com/skygenesisenterprise/zenthcloud)) ([1730fa2](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** use no-grit by default when running migration tests ([#6214](https://github.com/skygenesisenterprise/zenthcloud)) ([267dfc2](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dex_test:** Updated acceptance tests  ([#6183](https://github.com/skygenesisenterprise/zenthcloud)) ([cd7af0a](https://github.com/skygenesisenterprise/zenthcloud))
* Point to next version ([ac09de9](https://github.com/skygenesisenterprise/zenthcloud))
* modernize and expand zenthcloud_zero_trust_access_service_token test ([#6260](https://github.com/skygenesisenterprise/zenthcloud)) ([79e891e](https://github.com/skygenesisenterprise/zenthcloud))
* Modernize and expand test coverage for zero_trust_device_posture_rule ([#6259](https://github.com/skygenesisenterprise/zenthcloud)) ([6666597](https://github.com/skygenesisenterprise/zenthcloud))
* modernize and expand test coverage for zero_trust_gateway_policy ([#6266](https://github.com/skygenesisenterprise/zenthcloud)) ([9ad5fc1](https://github.com/skygenesisenterprise/zenthcloud))
* Modernize and expand test coverage for zero_trust_tunnel_zenthcloudd_route ([#6264](https://github.com/skygenesisenterprise/zenthcloud)) ([2c4a1e3](https://github.com/skygenesisenterprise/zenthcloud))
* modernize and fix zenthcloud_zone_dnssec tests with comprehensive ([#6254](https://github.com/skygenesisenterprise/zenthcloud)) ([d70cdd1](https://github.com/skygenesisenterprise/zenthcloud))
* modernize and improve zenthcloud_pages_project test coverage ([#6274](https://github.com/skygenesisenterprise/zenthcloud)) ([ebdbece](https://github.com/skygenesisenterprise/zenthcloud))
* sweepers for workers_kv and zero_trust_list ([#6281](https://github.com/skygenesisenterprise/zenthcloud)) ([2ed457a](https://github.com/skygenesisenterprise/zenthcloud))
* Update example values ([c889ef1](https://github.com/skygenesisenterprise/zenthcloud))
* Use zenthcloud-go v6.1.0 for v5.11.0 release ([5ae607d](https://github.com/skygenesisenterprise/zenthcloud))
* Fix config for disabling codegen in access_application ([75d8d6b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update composite API spec ([ee08de7](https://github.com/skygenesisenterprise/zenthcloud), [b75aafd](https://github.com/skygenesisenterprise/zenthcloud), [d140041](https://github.com/skygenesisenterprise/zenthcloud), [d22865a](https://github.com/skygenesisenterprise/zenthcloud), [cbf8d12](https://github.com/skygenesisenterprise/zenthcloud), [1b987a0](https://github.com/skygenesisenterprise/zenthcloud), [d98c4cc](https://github.com/skygenesisenterprise/zenthcloud), [02f821d](https://github.com/skygenesisenterprise/zenthcloud), [f965e4c](https://github.com/skygenesisenterprise/zenthcloud), [9663d30](https://github.com/skygenesisenterprise/zenthcloud), [7839869](https://github.com/skygenesisenterprise/zenthcloud), [d15f035](https://github.com/skygenesisenterprise/zenthcloud), [2a0c724](https://github.com/skygenesisenterprise/zenthcloud), [ca18700](https://github.com/skygenesisenterprise/zenthcloud), [7c43df9](https://github.com/skygenesisenterprise/zenthcloud), [0df0b82](https://github.com/skygenesisenterprise/zenthcloud), [a50d130](https://github.com/skygenesisenterprise/zenthcloud), [8fabca3](https://github.com/skygenesisenterprise/zenthcloud), [00bb6e6](https://github.com/skygenesisenterprise/zenthcloud), [f96417c](https://github.com/skygenesisenterprise/zenthcloud), [86e8862](https://github.com/skygenesisenterprise/zenthcloud), [270f556](https://github.com/skygenesisenterprise/zenthcloud), [226cce5](https://github.com/skygenesisenterprise/zenthcloud), [e8e7241](https://github.com/skygenesisenterprise/zenthcloud), [f720dde](https://github.com/skygenesisenterprise/zenthcloud), [125870b](https://github.com/skygenesisenterprise/zenthcloud), [e4b3a36](https://github.com/skygenesisenterprise/zenthcloud), [e4c0f73](https://github.com/skygenesisenterprise/zenthcloud 6b9f339161e2e8bc37fcf7e4ec8b4d), [82c913f](https://github.com/skygenesisenterprise/zenthcloud), [64ff1f0](https://github.com/skygenesisenterprise/zenthcloud), [516b468](https://github.com/skygenesisenterprise/zenthcloud), [b9b674c](https://github.com/skygenesisenterprise/zenthcloud), [0b6b710](https://github.com/skygenesisenterprise/zenthcloud), [fc1f691](https://github.com/skygenesisenterprise/zenthcloud), [7139af1](https://github.com/skygenesisenterprise/zenthcloud), [81d79a5](https://github.com/skygenesisenterprise/zenthcloud), [fcb14b6](https://github.com/skygenesisenterprise/zenthcloud), [efebe55](https://github.com/skygenesisenterprise/zenthcloud), [c0fb2a4](https://github.com/skygenesisenterprise/zenthcloud), [2978db8](https://github.com/skygenesisenterprise/zenthcloud), [ced7790](https://github.com/skygenesisenterprise/zenthcloud), [0ff7a11](https://github.com/skygenesisenterprise/zenthcloud), [04c89cb](https://github.com/skygenesisenterprise/zenthcloud), [4acb7ab](https://github.com/skygenesisenterprise/zenthcloud), [04236ca](https://github.com/skygenesisenterprise/zenthcloud), [7636b30](https://github.com/skygenesisenterprise/zenthcloud), [5c2d985](https://github.com/skygenesisenterprise/zenthcloud), [e52ffb1](https://github.com/skygenesisenterprise/zenthcloud), [133bb02](https://github.com/skygenesisenterprise/zenthcloud), [3fd9175](https://github.com/skygenesisenterprise/zenthcloud), [b5f2c46](https://github.com/skygenesisenterprise/zenthcloud), [f52687d](https://github.com/skygenesisenterprise/zenthcloud), [f1164d2](https://github.com/skygenesisenterprise/zenthcloud), [e4a44a8](https://github.com/skygenesisenterprise/zenthcloud), [da6a341](https://github.com/skygenesisenterprise/zenthcloud), [002316c](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([3457590](https://github.com/skygenesisenterprise/zenthcloud), [290fbad](https://github.com/skygenesisenterprise/zenthcloud), [8d68abc](https://github.com/skygenesisenterprise/zenthcloud), [ed99054](https://github.com/skygenesisenterprise/zenthcloud), [95603f6](https://github.com/skygenesisenterprise/zenthcloud), [e9b678b](https://github.com/skygenesisenterprise/zenthcloud), [2416723](https://github.com/skygenesisenterprise/zenthcloud), [2e822a9](https://github.com/skygenesisenterprise/zenthcloud), [b02b92c](https://github.com/skygenesisenterprise/zenthcloud), [7310778](https://github.com/skygenesisenterprise/zenthcloud), [7fb69e9](https://github.com/skygenesisenterprise/zenthcloud), [1f20a56](https://github.com/skygenesisenterprise/zenthcloud), [4a181d7](https://github.com/skygenesisenterprise/zenthcloud), [c800edc](https://github.com/skygenesisenterprise/zenthcloud), [3a74bdd](https://github.com/skygenesisenterprise/zenthcloud), [5fe113d](https://github.com/skygenesisenterprise/zenthcloud))


## 5.10.1 (2025-09-17)

Full Changelog: [v5.10.0...v5.10.1](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* grit to go ([#6162](https://github.com/skygenesisenterprise/zenthcloud)) ([b3c4779](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* zenthcloud_load_balancer transformation issues ([#6171](https://github.com/skygenesisenterprise/zenthcloud)) ([92f4a4a](https://github.com/skygenesisenterprise/zenthcloud))
* fix grit in migration tests ([#6175](https://github.com/skygenesisenterprise/zenthcloud)) ([0a25a5e](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero trust access application state migration ([07a5d06](https://github.com/skygenesisenterprise/zenthcloud))
* handling of nested arrays in ruleset migration ([#6187](https://github.com/skygenesisenterprise/zenthcloud)) ([a00b67f](https://github.com/skygenesisenterprise/zenthcloud))
* lb and lb pool config migration ([#6170](https://github.com/skygenesisenterprise/zenthcloud)) ([2af41f8](https://github.com/skygenesisenterprise/zenthcloud))
* lb monitor state migration ([#6180](https://github.com/skygenesisenterprise/zenthcloud)) ([c9811ba](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** block transformations ([#6203](https://github.com/skygenesisenterprise/zenthcloud)) ([245166d](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** fix main_module value migration ([#6204](https://github.com/skygenesisenterprise/zenthcloud)) ([fd24c07](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** improve `zone_setting` migrations ([#6169](https://github.com/skygenesisenterprise/zenthcloud)) ([6ba251f](https://github.com/skygenesisenterprise/zenthcloud))
* remove 'disable_railgun' from state after v4 migration ([#6186](https://github.com/skygenesisenterprise/zenthcloud)) ([453d774](https://github.com/skygenesisenterprise/zenthcloud))
* remove zone settings with null values ([#6201](https://github.com/skygenesisenterprise/zenthcloud)) ([f99bac4](https://github.com/skygenesisenterprise/zenthcloud))
* ruleset migration in nogrit ([#6174](https://github.com/skygenesisenterprise/zenthcloud)) ([ecb450d](https://github.com/skygenesisenterprise/zenthcloud))
* ruleset migration issues ([#6163](https://github.com/skygenesisenterprise/zenthcloud)) ([44b653c](https://github.com/skygenesisenterprise/zenthcloud))
* ruleset migration issues ([#6168](https://github.com/skygenesisenterprise/zenthcloud)) ([11b3961](https://github.com/skygenesisenterprise/zenthcloud))
* ruleset state ([#6191](https://github.com/skygenesisenterprise/zenthcloud)) ([dfd36a2](https://github.com/skygenesisenterprise/zenthcloud))
* variable interpolation ([#6193](https://github.com/skygenesisenterprise/zenthcloud)) ([332de8d](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** fix incorect model type of `run_worker_first` attribute ([#6199](https://github.com/skygenesisenterprise/zenthcloud)) ([13bf28d](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** ensure clean state after migrate ([#6190](https://github.com/skygenesisenterprise/zenthcloud)) ([41ae093](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* compare better ([#6192](https://github.com/skygenesisenterprise/zenthcloud)) ([ff67b9e](https://github.com/skygenesisenterprise/zenthcloud))
* enable mconn tests ([#6166](https://github.com/skygenesisenterprise/zenthcloud)) ([9c6653b](https://github.com/skygenesisenterprise/zenthcloud))
* limit max retries ([#6173](https://github.com/skygenesisenterprise/zenthcloud)) ([8c1c81c](https://github.com/skygenesisenterprise/zenthcloud))
* point transformations to gh/next ([#6177](https://github.com/skygenesisenterprise/zenthcloud)) ([c35109a](https://github.com/skygenesisenterprise/zenthcloud))
* zero trust config issues ([#6179](https://github.com/skygenesisenterprise/zenthcloud)) ([07a5d06](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* **list_item:** add import documentation ([#6202](https://github.com/skygenesisenterprise/zenthcloud)) ([55e12bc](https://github.com/skygenesisenterprise/zenthcloud))

## 5.10.0 (2025-09-12)

Full Changelog: [v5.9.0...v5.10.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add 'ruleset' support in migration tool ([#6104](https://github.com/skygenesisenterprise/zenthcloud)) ([82158eb](https://github.com/skygenesisenterprise/zenthcloud))
* add migration tool support for zenthcloud_snippet ([79e19d3](https://github.com/skygenesisenterprise/zenthcloud))
* add migration tool support for zenthcloud_snippet_rules ([b1d4e92](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_list:** add nested list items to data source ([0818c2d](https://github.com/skygenesisenterprise/zenthcloud))
* **zenthcloud_list:** add nested set list items ([f96b922](https://github.com/skygenesisenterprise/zenthcloud))
* handle list items in v4 ([5c315f2](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** support CustomMarshaler interface for encoding types ([3ce3cbc](https://github.com/skygenesisenterprise/zenthcloud))
* Merge branch 'vaishak/bump-sdk-version' into 'main' ([2d4ae17](https://github.com/skygenesisenterprise/zenthcloud))
* merge items into list ([0709233](https://github.com/skygenesisenterprise/zenthcloud))
* migrate list with embedded items from v4 to v5 ([40ff2dd](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** add comprehensive workers cross-resource reference support ([39032e3](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** fix load_balancer migration test ([#6148](https://github.com/skygenesisenterprise/zenthcloud)) ([1d21133](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** implement comprehensive workers_script v4→v5 bindings migration ([59d436b](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** implement remaining workers_script binding migration fixes ([6324582](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** support migrations for workers_route and workers_script ([3308fa5](https://github.com/skygenesisenterprise/zenthcloud))
* migration tests ([1e35d38](https://github.com/skygenesisenterprise/zenthcloud))
* migration tests ([8ec2d24](https://github.com/skygenesisenterprise/zenthcloud))
* modernize healthcheck tests ([74a358d](https://github.com/skygenesisenterprise/zenthcloud))
* modernize notification_policy_webhooks tests ([bbab7d5](https://github.com/skygenesisenterprise/zenthcloud))
* modernize r2_bucket tests ([ecf2609](https://github.com/skygenesisenterprise/zenthcloud))
* modernize zero_trust_dlp_custom_profile tests ([cb11079](https://github.com/skygenesisenterprise/zenthcloud))
* modernize zero_trust_dlp_entry tests ([6f0a6b1](https://github.com/skygenesisenterprise/zenthcloud))
* modernize zero_trust_list tests ([27e8cab](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** validate action parameters are used with correct action ([578879e](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_route, workers_script:** implement migration for workers_(script|route) ([ff3e68e](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** add v4 -&gt; v5 migrations ([279070c](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** implement migrations ([717787a](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* broken test data and block attribute conversion ([#6138](https://github.com/skygenesisenterprise/zenthcloud)) ([6a07ac2](https://github.com/skygenesisenterprise/zenthcloud))
* ci workflows ([ee2117a](https://github.com/skygenesisenterprise/zenthcloud))
* comment_modified_on drift in DNS records ([b5bdee4](https://github.com/skygenesisenterprise/zenthcloud))
* discord failure ([8b8eb19](https://github.com/skygenesisenterprise/zenthcloud))
* dns record empty states ([e8f418e](https://github.com/skygenesisenterprise/zenthcloud))
* don't announce to discord ([9e7a495](https://github.com/skygenesisenterprise/zenthcloud))
* dynamic 'origins' blocks migrations ([8d5de51](https://github.com/skygenesisenterprise/zenthcloud))
* dynamic blocks and tests ([4d6855c](https://github.com/skygenesisenterprise/zenthcloud))
* fix snippets tests ([52dfe49](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero_trust_dlp_entry acceptance tests ([5007122](https://github.com/skygenesisenterprise/zenthcloud))
* inconsistent apply Issue [#6076](https://github.com/skygenesisenterprise/zenthcloud) ([#6139](https://github.com/skygenesisenterprise/zenthcloud)) ([0e9650f](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** add missing hyperdrive binding attribute renames ([fc6b137](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** correct module transformation and clean up dead code tests ([c364035](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** custom_pages state migrations ([8b4e1cf](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** implement dispatch_namespace attribute to binding migration ([3a432dd](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** implement module attribute to main_module/body_part migration ([dd94222](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** implement workers_secret cross-resource migration to secret_text bindings ([5ff5c6c](https://github.com/skygenesisenterprise/zenthcloud))
* migrations for config and state ([24e44b0](https://github.com/skygenesisenterprise/zenthcloud))
* more roboust retry logic for certificate tests ([#6154](https://github.com/skygenesisenterprise/zenthcloud)) ([25039bc](https://github.com/skygenesisenterprise/zenthcloud))
* nil dereference in `zenthcloud_workers_script` resource ([#6158](https://github.com/skygenesisenterprise/zenthcloud)) ([bcfc129](https://github.com/skygenesisenterprise/zenthcloud)), closes [#6147](https://github.com/skygenesisenterprise/zenthcloud)
* prevent resource type corruption in workers_secret state migration ([abc0548](https://github.com/skygenesisenterprise/zenthcloud))
* prevent resource type corruption in workers_secret state migration ([adbbae2](https://github.com/skygenesisenterprise/zenthcloud))
* required field ttl ([b88e5b8](https://github.com/skygenesisenterprise/zenthcloud))
* resolve race condition in zero_trust_access_mtls_hostname_settings migration tests ([#6152](https://github.com/skygenesisenterprise/zenthcloud)) ([9c6deef](https://github.com/skygenesisenterprise/zenthcloud))
* run spinnets in sequence ([0789979](https://github.com/skygenesisenterprise/zenthcloud))
* skip acceptance tests in unit test scope ([#6155](https://github.com/skygenesisenterprise/zenthcloud)) ([e860eb5](https://github.com/skygenesisenterprise/zenthcloud))
* snippet and load balancer migration tests ([#6149](https://github.com/skygenesisenterprise/zenthcloud)) ([a347ebc](https://github.com/skygenesisenterprise/zenthcloud))
* state ([5742920](https://github.com/skygenesisenterprise/zenthcloud))
* state test ([16c5fc2](https://github.com/skygenesisenterprise/zenthcloud))
* tests ([84f27a3](https://github.com/skygenesisenterprise/zenthcloud))
* tiered cache test ([408a4b6](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** fix/improve bindings tests ([fca02f3](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** get tests passing again ([404a241](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** referenced attribute renames ([#6136](https://github.com/skygenesisenterprise/zenthcloud)) ([29d686c](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** resolve binding order infinite loop in v5 provider ([a05f552](https://github.com/skygenesisenterprise/zenthcloud))
* zero trust access indetity provider migration ([7bc2a5d](https://github.com/skygenesisenterprise/zenthcloud))
* zero trust access mtls certificate acceptance tests ([7e91d44](https://github.com/skygenesisenterprise/zenthcloud))
* zero trust migrations ([ddc8642](https://github.com/skygenesisenterprise/zenthcloud))
* zero_trust_access_mtls_certificate acceptance tests ([b163147](https://github.com/skygenesisenterprise/zenthcloud))
* zero_trust_device_custom_profile sweeper ([f0ed7ca](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **account_member:** remove bad test ([21c670d](https://github.com/skygenesisenterprise/zenthcloud))
* **account_member:** update acceptance tests ([1988556](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** update acceptance tests ([1f6be84](https://github.com/skygenesisenterprise/zenthcloud))
* **account:** update acceptance tests ([1f49327](https://github.com/skygenesisenterprise/zenthcloud))
* add migration tool support for load_balancer and load_balancer_pool ([a985fa0](https://github.com/skygenesisenterprise/zenthcloud))
* **api_token:** update acceptance tests ([5d02104](https://github.com/skygenesisenterprise/zenthcloud))
* ci tests dependencies and job tracking ([a2142fb](https://github.com/skygenesisenterprise/zenthcloud))
* enable more ci tests ([cd96052](https://github.com/skygenesisenterprise/zenthcloud))
* fix list item state migration ([#6146](https://github.com/skygenesisenterprise/zenthcloud)) ([7cc6425](https://github.com/skygenesisenterprise/zenthcloud))
* fix transformation source ([#6157](https://github.com/skygenesisenterprise/zenthcloud)) ([6cc2cfb](https://github.com/skygenesisenterprise/zenthcloud))
* grit to go ([#6143](https://github.com/skygenesisenterprise/zenthcloud)) ([548f097](https://github.com/skygenesisenterprise/zenthcloud))
* increase parallel jobs ([9f1a098](https://github.com/skygenesisenterprise/zenthcloud))
* increase retries ([#6156](https://github.com/skygenesisenterprise/zenthcloud)) ([309397c](https://github.com/skygenesisenterprise/zenthcloud))
* remove files that are not needed ([064c780](https://github.com/skygenesisenterprise/zenthcloud))
* remove grit ([d840087](https://github.com/skygenesisenterprise/zenthcloud))
* remove grit for lists ([f7d6229](https://github.com/skygenesisenterprise/zenthcloud))
* remove skips ([adee34c](https://github.com/skygenesisenterprise/zenthcloud))
* retry tests ([#6150](https://github.com/skygenesisenterprise/zenthcloud)) ([fc88bf8](https://github.com/skygenesisenterprise/zenthcloud))
* revert grit to go ([#6159](https://github.com/skygenesisenterprise/zenthcloud)) ([09bfa12](https://github.com/skygenesisenterprise/zenthcloud))
* run goimport ([f837802](https://github.com/skygenesisenterprise/zenthcloud))
* sequence magic tests ([#6145](https://github.com/skygenesisenterprise/zenthcloud)) ([156694c](https://github.com/skygenesisenterprise/zenthcloud))
* skip mconn test ([#6161](https://github.com/skygenesisenterprise/zenthcloud)) ([e181aef](https://github.com/skygenesisenterprise/zenthcloud))
* tests ([47a4330](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add lots of missing bindings tests ([dc27751](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** remove unused tests ([505c840](https://github.com/skygenesisenterprise/zenthcloud))
* **zone:** add migration tests ([b02bf9b](https://github.com/skygenesisenterprise/zenthcloud))


### Refactors

* **migrate:** add resource rename support to workers_route and workers_script ([35eaca1](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** clean up duplicate bindings maps ([2393057](https://github.com/skygenesisenterprise/zenthcloud))

## 5.9.0 (2025-08-29)

Full Changelog: [v5.8.4...v5.9.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add comprehensive zero_trust_access_group v4→v5 migration support ([44b55c1](https://github.com/skygenesisenterprise/zenthcloud))
* add job IDs ([8bcdbd5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b9b17cf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8ec5c0e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([fb4eddb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([12c4328](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([511614c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1d22129](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7391faf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4fa333d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5f93f24](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b584f87](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ff12699](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ad38f3f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([51bbca9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d873115](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a6065ba](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2545b2c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([abcd800](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9251429](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4980f38](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([76010ab](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([627dfd8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b6e00b8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8bfb0c4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d614e59](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b1cb9f3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([098a710](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([da44c34](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([276d413](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([403f6a6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([51788e7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([841fa60](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([cfcd80d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8832c77](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f02e8ce](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([bfd878b](https://github.com/skygenesisenterprise/zenthcloud))
* implement automated v4→v5 migrations for zero trust access application ([344d995](https://github.com/skygenesisenterprise/zenthcloud))
* implement automated v4→v5 migrations for zero trust access policy ([204a2c0](https://github.com/skygenesisenterprise/zenthcloud))
* implement comprehensive v4 to v5 migration for zero_trust_access_group resources ([c63bd93](https://github.com/skygenesisenterprise/zenthcloud))
* implement comprehensive v4→v5 migration for tiered_cache resources ([1d763a9](https://github.com/skygenesisenterprise/zenthcloud))
* migrate argo ([21bef66](https://github.com/skygenesisenterprise/zenthcloud))
* migrate state ([47c25c2](https://github.com/skygenesisenterprise/zenthcloud))
* migrate state ([799e3c2](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** fix access application domain_type and destinations migration ([f572e62](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** remove skip_app_launcher_login_page when type is not app_launcher ([1cfa5ec](https://github.com/skygenesisenterprise/zenthcloud))
* migrations for zero_trust_access_application ([bb35c7c](https://github.com/skygenesisenterprise/zenthcloud))
* migrations for zero_trust_access_identity_provider ([75e412f](https://github.com/skygenesisenterprise/zenthcloud))
* migrations for zero_trust_access_mtls_certificate ([4d547c5](https://github.com/skygenesisenterprise/zenthcloud))
* migrations for zero_trust_access_mtls_hostname_settings ([82ff1cb](https://github.com/skygenesisenterprise/zenthcloud))
* parallel test runs ([48d5c35](https://github.com/skygenesisenterprise/zenthcloud))
* **regional_hostname:** support migration from v4 to v5 ([ffd589d](https://github.com/skygenesisenterprise/zenthcloud))
* state upgrader ([ed2ad91](https://github.com/skygenesisenterprise/zenthcloud))
* sweeper for magic_wan_static_route ([51728f9](https://github.com/skygenesisenterprise/zenthcloud))
* zero trust access policy migrations ([134df93](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* 'created_on' API inconsistencies in LB pool ([e8d34db](https://github.com/skygenesisenterprise/zenthcloud))
* access application model schema parity ([94311b7](https://github.com/skygenesisenterprise/zenthcloud))
* account_member tests ([832a05a](https://github.com/skygenesisenterprise/zenthcloud))
* api_token ([3846ff9](https://github.com/skygenesisenterprise/zenthcloud))
* drift ([6e5659d](https://github.com/skygenesisenterprise/zenthcloud))
* dynamic type validators should handle int and floats correctly ([5ae1226](https://github.com/skygenesisenterprise/zenthcloud))
* enable account_member tests ([d3ba4ab](https://github.com/skygenesisenterprise/zenthcloud))
* encoder crash for nested nils in dynamic types ([91e9782](https://github.com/skygenesisenterprise/zenthcloud))
* enhance DNS record sweeper to prevent apex domain test conflicts ([4be8681](https://github.com/skygenesisenterprise/zenthcloud))
* grit patterns ([736b9ac](https://github.com/skygenesisenterprise/zenthcloud))
* grit patterns for dns records ([6e0785e](https://github.com/skygenesisenterprise/zenthcloud))
* handle empty tags ([35ab9f7](https://github.com/skygenesisenterprise/zenthcloud))
* implement migration for ZT IDP in the migrate tool ([df2289e](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer_monitor:** Fix detected drift on refresh ([024f015](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer:** Fix detected drift on refresh and update ([3d06582](https://github.com/skygenesisenterprise/zenthcloud))
* migrate for managed headers ([8398f4f](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** fix incorrect setting name for `0rtt` ([4943ca2](https://github.com/skygenesisenterprise/zenthcloud))
* **migrate:** fix zone_settings migrations ([d24ce96](https://github.com/skygenesisenterprise/zenthcloud))
* populate computed_optional collections from API responses ([d6c64dc](https://github.com/skygenesisenterprise/zenthcloud))
* properly handle null nested objects in customfield marshaling ([61c808d](https://github.com/skygenesisenterprise/zenthcloud))
* remove state upgrade ([c6716e7](https://github.com/skygenesisenterprise/zenthcloud))
* resolve test failures in magic_wan_static_route and ([11d91df](https://github.com/skygenesisenterprise/zenthcloud))
* resolve type mismatches in zero trust access policy and application migrations ([8e3b4b6](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Add plan check validations to zenthcloud_zero_trust_tunnel_zenthcloudd_route resource ([c94fb5b](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** add planmodifiers for dynamic type ([eaf6f17](https://github.com/skygenesisenterprise/zenthcloud))
* use planmodifier for zone_settings value normalization ([468f59a](https://github.com/skygenesisenterprise/zenthcloud))
* wire up migrates ([54c3248](https://github.com/skygenesisenterprise/zenthcloud))
* zero trust access policy acceptance tests ([4804ca3](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile_local_domain_fallback:** fix recurring diffs and add acceptance tests for multiple domains ([c8e790a](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_custom_profile:** fix recurring diffs and add acceptance tests ([2b358e6](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** remove grit patterns for `zenthcloud_zone_settings_override` ([3b6edda](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* add load balancer acceptance tests to CI ([b9df93d](https://github.com/skygenesisenterprise/zenthcloud))
* add sweeper for magic_wan_gre_tunnel ([e31976a](https://github.com/skygenesisenterprise/zenthcloud))
* add tests for zero_trust_device_custom_profile ([cc567a8](https://github.com/skygenesisenterprise/zenthcloud))
* add zero trust device tests to CI ([bcff1a8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([9a32393](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([00d150d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([ca57125](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([416b5c1](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** skip ZT mTLS tests ([289ce58](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** temporarily disable migration tests ([e1c5b3d](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** temporarily disable migration tests ([8ab562f](https://github.com/skygenesisenterprise/zenthcloud))
* clean up ([0415065](https://github.com/skygenesisenterprise/zenthcloud))
* comment modified on test ([d403d5f](https://github.com/skygenesisenterprise/zenthcloud))
* disable failing queue and r2bucket sweepers ([e1394a8](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** generate provider docs ([d86327b](https://github.com/skygenesisenterprise/zenthcloud))
* fix ci script ([5991be1](https://github.com/skygenesisenterprise/zenthcloud))
* fix magic_wan_ipsec_tunnel acceptance tests ([5f5b50a](https://github.com/skygenesisenterprise/zenthcloud))
* fix sweepers for many resources ([c2f66f6](https://github.com/skygenesisenterprise/zenthcloud))
* fix TestAccZenthcloudAccessOrganization ([8b0e176](https://github.com/skygenesisenterprise/zenthcloud))
* fix TestAccZenthcloudAccessPolicy_ApprovalGroup ([52ef60b](https://github.com/skygenesisenterprise/zenthcloud))
* fix workers_script tests ([1116eac](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero_trust_access_identity_provider tests ([2575473](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero_trust_access_mtls_certificate acct tests ([a00f421](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero_trust_access_mtls_hostname_settings tests ([166517f](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero_trust_tunnel_zenthcloudd_route ([0e961f7](https://github.com/skygenesisenterprise/zenthcloud))
* fix zero_trust_tunnel_zenthcloudd_route tests ([3c51256](https://github.com/skygenesisenterprise/zenthcloud))
* improve integrity test error messages ([2d410d2](https://github.com/skygenesisenterprise/zenthcloud))
* increase ci test timeout ([5da9eab](https://github.com/skygenesisenterprise/zenthcloud))
* increase number of ci jobs ([50ee749](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** add test rule to lint for dynamic attributes that do not have planmodifier ([a725465](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([42115d7](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([8feeada](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([17863a2](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0bd098f](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([4e59511](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([55d5985](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([5505692](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([7765dbf](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([1748ea8](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([e0eff5c](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([cde67a4](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([5d2fe3d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([a9610ce](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([90aa9c5](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([2b37de1](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([b27f531](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([2275aa2](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([4cbcff5](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([2136d08](https://github.com/skygenesisenterprise/zenthcloud))
* **load_balancer_pool:** fix test data and skip broken test ([3be61aa](https://github.com/skygenesisenterprise/zenthcloud))
* merge acct GH steps into a single step ([d27710c](https://github.com/skygenesisenterprise/zenthcloud))
* more tests and drift ([f1cc4ac](https://github.com/skygenesisenterprise/zenthcloud))
* parallel ci test runs ([260a5b9](https://github.com/skygenesisenterprise/zenthcloud))
* remove state upgraders ([ca04b97](https://github.com/skygenesisenterprise/zenthcloud))
* remove version from schema ([73f2e17](https://github.com/skygenesisenterprise/zenthcloud))
* run sweeper before any test run ([5bac861](https://github.com/skygenesisenterprise/zenthcloud))
* separate acceptance and migration tests ([e466442](https://github.com/skygenesisenterprise/zenthcloud))
* skip failing ruleset test ([7746f2b](https://github.com/skygenesisenterprise/zenthcloud))
* skip failing sweepers ([46810fe](https://github.com/skygenesisenterprise/zenthcloud))
* update all cf-go v5 -&gt; v6 imports ([2cd840f](https://github.com/skygenesisenterprise/zenthcloud))
* we can have only 3 parallel jobs ([588c710](https://github.com/skygenesisenterprise/zenthcloud))
* wire up migrate commands ([b574a2a](https://github.com/skygenesisenterprise/zenthcloud))
* zero_trust_access_mtls_certificate tests ([07e374e](https://github.com/skygenesisenterprise/zenthcloud))

## 5.8.4 (2025-08-15)

Full Changelog: [v5.8.3...v5.8.4](https://github.com/skygenesisenterprise/zenthcloud)

### Bug Fixes

* **zenthcloud_ruleset:** update for consistency with OpenAPI schema ([837da07](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* don't announce to discord ([1816fff](https://github.com/skygenesisenterprise/zenthcloud))
* generate docs for 5.8.4 release ([ae12b37](https://github.com/skygenesisenterprise/zenthcloud))
* only include ones that have tests ([ebc40cf](https://github.com/skygenesisenterprise/zenthcloud))
* run one by one ([1185be7](https://github.com/skygenesisenterprise/zenthcloud))

## 5.8.3 (2025-08-15)

Full Changelog: [v5.8.2...v5.8.3](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **api:** api update ([23eb89c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([57928dc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3351a79](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b1afd55](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([aa5ac4d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([01bea92](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5bf6360](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([698d90c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c9f96d3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f5ee559](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2568efa](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5afa7cb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7cd55d3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f1b07f6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0e1f55c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([535c250](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([dda8106](https://github.com/skygenesisenterprise/zenthcloud))
* **apijson:** add `decode_null_to_zero` tag option ([71538e5](https://github.com/skygenesisenterprise/zenthcloud))
* **apijson:** move changes to new `apijsoncustom` package ([f5b955b](https://github.com/skygenesisenterprise/zenthcloud))
* ensure `internal/apiform` encoder can handle "force_encode" serialization tag ([0d8e9ee](https://github.com/skygenesisenterprise/zenthcloud))
* ensure `internal/apiform` encoder can handle "force_encode" serialization tag ([840ee94](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **zenthcloud_ruleset:** handle omitted `rules` in API responses ([7f15668](https://github.com/skygenesisenterprise/zenthcloud))
* dont run in parallel ([9c952a9](https://github.com/skygenesisenterprise/zenthcloud))
* imports ([4369f06](https://github.com/skygenesisenterprise/zenthcloud))
* list item test execution and add managed_transforms ([c3c3bb4](https://github.com/skygenesisenterprise/zenthcloud))
* **list_item:** Use proper pagination from client ([8f692ad](https://github.com/skygenesisenterprise/zenthcloud))
* regex to not account order ([1e2d64d](https://github.com/skygenesisenterprise/zenthcloud))
* remove workers_for_platforms_dispatch_namespace default value for 'trusted_workers' ([dded442](https://github.com/skygenesisenterprise/zenthcloud))
* test assertion regex ([9a0b7ab](https://github.com/skygenesisenterprise/zenthcloud))
* test data ([1cc94d4](https://github.com/skygenesisenterprise/zenthcloud))
* update schema ([6c97aad](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** ignore unmanaged secret_text bindings ([a3b6816](https://github.com/skygenesisenterprise/zenthcloud)), closes [#5892](https://github.com/skygenesisenterprise/zenthcloud)
* **workers_script:** Obtain migrations directly from config instead of plan ([2602dba](https://github.com/skygenesisenterprise/zenthcloud)), closes [#5898](https://github.com/skygenesisenterprise/zenthcloud)
* **workers_script:** Revert treating zenthcloud_workers_script.bindings as a Set ([757b98f](https://github.com/skygenesisenterprise/zenthcloud))
* zero_trust_access_application tests ([d7eccc3](https://github.com/skygenesisenterprise/zenthcloud))
* zt orgs ([fc9f9a2](https://github.com/skygenesisenterprise/zenthcloud))
* zt orgs another way ([93f95cd](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* add bot management test ([6114b7d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([68454d3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([33e7b03](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([bf113c7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([7b2fe37](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([9c03a0e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([9babc23](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([872f8ba](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([b21ea4a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([5790fb1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([2016bf8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([ef987a8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([26c37c4](https://github.com/skygenesisenterprise/zenthcloud))
* enable token-based auth for acceptance tests ([20ea7d8](https://github.com/skygenesisenterprise/zenthcloud))
* extra checks ([3e5591e](https://github.com/skygenesisenterprise/zenthcloud))
* fix deterministic zone names in zenthcloud_zone acceptance tests ([1de0cc3](https://github.com/skygenesisenterprise/zenthcloud))
* fix TestAccZenthcloudAccessIdentityProvider_OAuth_Import ([82c589a](https://github.com/skygenesisenterprise/zenthcloud))
* fix ZT mtls certificate acceptance tests ([cda1128](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** upgrade zenthcloud/circl ([2df21d4](https://github.com/skygenesisenterprise/zenthcloud))
* modernize zero_trust_access_mtls_hostname_settings tests ([0a0556b](https://github.com/skygenesisenterprise/zenthcloud))
* new line ([1c0eb79](https://github.com/skygenesisenterprise/zenthcloud))
* no-op plan ([db1b335](https://github.com/skygenesisenterprise/zenthcloud))
* remove line ([1adfcc1](https://github.com/skygenesisenterprise/zenthcloud))
* Revert "enable token-based auth for acceptance tests" ([d13f98a](https://github.com/skygenesisenterprise/zenthcloud))
* skip api_token test until we configure CI to support token-based auth ([4a84a94](https://github.com/skygenesisenterprise/zenthcloud))
* skip flaky zero_trust_access_application test ([8107984](https://github.com/skygenesisenterprise/zenthcloud))
* skip test failing due to inconsistent apply with sensitive value ([9336894](https://github.com/skygenesisenterprise/zenthcloud))
* skip unicode 'zone' tests and extend sleeps for mtls certs ([9871bfa](https://github.com/skygenesisenterprise/zenthcloud))
* sort imports ([dc52145](https://github.com/skygenesisenterprise/zenthcloud))
* tidy up ([49b1243](https://github.com/skygenesisenterprise/zenthcloud))
* uncomment check ([b24e573](https://github.com/skygenesisenterprise/zenthcloud))
* update @stainless-api/prism-cli to v5.15.0 ([7534488](https://github.com/skygenesisenterprise/zenthcloud))
* update ci list ([13e5c5e](https://github.com/skygenesisenterprise/zenthcloud))
* update managed_transform tests ([ad82abe](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** use resourcevalidator.ExactlyOneOf() to ensure `content` or `content_file` is provided ([e9d000c](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* add a warning to workers_script ([5aa1016](https://github.com/skygenesisenterprise/zenthcloud))

## 5.8.2 (2025-08-01)

Full Changelog: [v5.8.1...v5.8.2](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **api:** api update ([54b3c10](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8666096](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* update model for zt gateway settings ([a084e1b](https://github.com/skygenesisenterprise/zenthcloud))

## 5.8.1 (2025-08-01)

Full Changelog: [v5.8.0...v5.8.1](https://github.com/skygenesisenterprise/zenthcloud)

### Bug Fixes

* custom page tests ([bd3c296](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **docs:** generate provider documentation ([21a9cd4](https://github.com/skygenesisenterprise/zenthcloud))
* skip flaky tests ([890d693](https://github.com/skygenesisenterprise/zenthcloud))
* snippet rules not ready ([e2312e2](https://github.com/skygenesisenterprise/zenthcloud))
* update zone name for tests and not in parallel ([d3b0d00](https://github.com/skygenesisenterprise/zenthcloud))

## 5.8.0 (2025-08-01)

Full Changelog: [v5.7.1...v5.8.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **api:** api update ([b2e32df](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([daa1cbb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5dc00ef](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b8aac5d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b490b66](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2c8a947](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b8768d3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1efccfd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2e1f574](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2333c4b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7d07c43](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5a661e8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6f54311](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f2ac6c5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([cf7e91b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([04a9002](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1a0fdc5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d42b931](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5280cf8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4917756](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7fbafd5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([709e28a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9773002](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3120f94](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1b34fa3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([911115b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5086198](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([83f8053](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c1de739](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9742219](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c9f52e4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([62dab18](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5e36c02](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2e75b98](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([eb4c002](https://github.com/skygenesisenterprise/zenthcloud))
* state migration for custom_pages ([d826ae8](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add support for `content_type` attribute (necessary for Python Workers) ([21b235a](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* add version back to extended email settings for gateway ([81df358](https://github.com/skygenesisenterprise/zenthcloud))
* initial snippets acceptance tests ([e2d6a0e](https://github.com/skygenesisenterprise/zenthcloud))
* list item model ([b64e4fc](https://github.com/skygenesisenterprise/zenthcloud))
* make gateway settings host selector + inspection optional ([a5cbc80](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add missing `workflow` value to `bindings.type` validator ([cb5d655](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** fix nested computed attributes under `bindings` causing unwarranted plan diffs ([ab9dd38](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** handle `text` value for `secret_text` bindings during refresh plan ([3ff7ac3](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** handle empty `placement`  object during refresh plan ([ee64d6b](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** mark `migrations` as WriteOnly ([409e81b](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_gateway_settings:** remove leftover import ([1c3c135](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **api:** update composite API spec ([c1d05a1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload OpenAPI schema from api-schemas ([cb6f526](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([033cf6d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([d30fb7f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([59efb43](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([0ac93c5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** upload stainless config from zenthcloud-config ([91aa4e4](https://github.com/skygenesisenterprise/zenthcloud))
* fix code formatting ([ff642bc](https://github.com/skygenesisenterprise/zenthcloud))
* housekeeping ([a42c70a](https://github.com/skygenesisenterprise/zenthcloud))
* missing import ([629f60d](https://github.com/skygenesisenterprise/zenthcloud))
* remove redundant newline ([2a4b8f7](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** Add acceptance tests for WARP Connector resource ([62f19ce](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** add import verification step to test cases ([f89916c](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** update tests to replace legacy check functions with state checks ([6181db3](https://github.com/skygenesisenterprise/zenthcloud))

## 5.7.1 (2025-07-15)

Full Changelog: [v5.7.0...v5.7.1](https://github.com/skygenesisenterprise/zenthcloud)

### Bug Fixes

* **api:** Fix update/read path parameter for zone subscription ([c763edf](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **internal:** version bump ([5d9412c](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** version bump ([93e874a](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** version bump ([5fa684d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** version bump ([68327f2](https://github.com/skygenesisenterprise/zenthcloud))

## 5.7.0 (2025-07-14)

Full Changelog: [v5.6.0...v5.7.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **api:** Add 'zero_trust_tunnel_warp_connector' Terraform resource ([204d752](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** Add DELETE and POST routes for Magic Connector ([b3c8c0a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([85a1a2f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c20c04c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f936dc9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a5634a8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d7e118c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7a1200e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([97ea6d6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([75e1515](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([223c0ff](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7e9304b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b98281d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d94fb1f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7861f45](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([534cc05](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([39676a0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c449ded](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([de3965a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ab0e41a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c8168f2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([371b58e](https://github.com/skygenesisenterprise/zenthcloud))
* new option to send computed values back to server ([2b9c5d5](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** support `content_file` and `content_sha256` attribute pair as alternative to `content` ([6c850b0](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_dlp:** Added individual resources and new routes ([2b7185f](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* assertion ([58392a5](https://github.com/skygenesisenterprise/zenthcloud))
* ci jobs ([8fd4d84](https://github.com/skygenesisenterprise/zenthcloud))
* ci run setup ([b38f788](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** release-doctor — report correct token name ([87e54a5](https://github.com/skygenesisenterprise/zenthcloud))
* **logpull_retention:** Fix Terraform ID property ([de3811f](https://github.com/skygenesisenterprise/zenthcloud))
* null nested attribute decoding ([5ba7d5b](https://github.com/skygenesisenterprise/zenthcloud))
* **terraform:** strip leading/trailing underscores from attribute names ([e00ca4b](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_subscription:** Fix incorrect path identifier on Update and Read ([e00223d](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **api:** Specify default value for Zone Lockdown 'paused' property ([808598c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** Specify default value for Zone Lockdown 'paused' property ([072f9f7](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** only run for pushes and fork pull requests ([df566b9](https://github.com/skygenesisenterprise/zenthcloud))
* **config:** bump zenthcloud-go ([8671c9a](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([70ba827](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([f29c24a](https://github.com/skygenesisenterprise/zenthcloud))
* run steps on failure ([c7360a5](https://github.com/skygenesisenterprise/zenthcloud))
* skip flaky list item tests due to rate limit ([85f5b78](https://github.com/skygenesisenterprise/zenthcloud))
* skip flaky list item tests due to rate limit ([c980fdc](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Fix acceptance test runner ([c964479](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Fix model parity tests ([52446ec](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip GRE tunnel tests ([7278846](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip magic tests when we don't have the right environment ([c8c505b](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip some Access IDP tests ([9e13c6f](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip some rulesets tests ([263f43c](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip TestAccZenthcloudAPIShieldBasic ([b5a6ba3](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip TestAccZenthcloudAPITokenData ([11f728d](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip TestAccZenthcloudTeamsList_LottaListItems ([7e6c4da](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip zone lockdown tests ([bfe7436](https://github.com/skygenesisenterprise/zenthcloud))
* **test:** Skip zone subscription tests ([a533043](https://github.com/skygenesisenterprise/zenthcloud))
* update docs ([884dcd8](https://github.com/skygenesisenterprise/zenthcloud))
* update docs ([cd30cb5](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_subscription:** Fix ID property configuration ([b762cf2](https://github.com/skygenesisenterprise/zenthcloud))

## 5.6.0 (2025-06-17)

Full Changelog: [v5.5.0...v5.6.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **api:** Add IAM User Groups and AutoRAG ([56dcaf3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f5f9fab](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([16f59b7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([38cc34f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([87dfb9f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9d65aaf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([db05444](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d373046](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7f788ec](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c412337](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([39a8871](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7af8e9c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([10873d4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b298896](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2f3e6c2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([280f050](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([df6b8bf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([557f7d0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b53ba74](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([971ca4a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ef92b4a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([79649c8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([dbc97dc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d09845d](https://github.com/skygenesisenterprise/zenthcloud))
* **client:** support environments property from Stainless config ([2e9ad1c](https://github.com/skygenesisenterprise/zenthcloud))
* **schema_validation:** add terraform resource mappings ([e2f968e](https://github.com/skygenesisenterprise/zenthcloud))
* support import when resource ID is in read method request body ([500f710](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* add missing properties ([a21b2bc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** Update zone subscription paths ([e021998](https://github.com/skygenesisenterprise/zenthcloud))
* page rule panic [#5577](https://github.com/skygenesisenterprise/zenthcloud) ([a3c643d](https://github.com/skygenesisenterprise/zenthcloud))
* **schema:** better support top-level arrays in paginated responses ([e6331d5](https://github.com/skygenesisenterprise/zenthcloud))
* **static_route:** API can accept single routes now ([ac52503](https://github.com/skygenesisenterprise/zenthcloud))
* **WDAPI:** Fix 'id_property' for zero_trust_device_default_profile_local_domain_fallback ([c409fd4](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **api:** TTL is required on DNS records ([6f3f1cb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** Update Go SDK version for Terraform provider ([27e835d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** Update Go SDK version for Terraform provider ([082cf15](https://github.com/skygenesisenterprise/zenthcloud))
* bump deps to avoid GetResourceIdentitySchemas errors for Terraform CLI v1.12+ ([7bceb8f](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** enable for pull requests ([779c686](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([24c025e](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([50b8e95](https://github.com/skygenesisenterprise/zenthcloud))

## 5.5.0 (2025-05-19)

Full Changelog: [v5.4.0...v5.5.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **api:** api update ([3823991](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([831ce6c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0a3e31a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([bf3db8c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([315bae3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e8e9f5c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9275cc7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9d82124](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([736d315](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0ae0584](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5f69644](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([275a65a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([51f1988](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7a7cce4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([d7f399a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([8356001](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_subdomain:** mark endpoint for upsert ([f3cd535](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **api:** fix path placeholders ([0964b9a](https://github.com/skygenesisenterprise/zenthcloud))
* **cloud_connector_rules:** define upsert operations ([db4e2aa](https://github.com/skygenesisenterprise/zenthcloud))
* **cloud_connector_rules:** fix nested schema bodies ([#5559](https://github.com/skygenesisenterprise/zenthcloud)) ([64edb91](https://github.com/skygenesisenterprise/zenthcloud))
* **cloud_connector_rules:** remove outdated warning ([#5560](https://github.com/skygenesisenterprise/zenthcloud)) ([d7d6ad0](https://github.com/skygenesisenterprise/zenthcloud))
* **cloud_connector_rules:** reuse zone_id for anchor aliasing ([bb5cbf3](https://github.com/skygenesisenterprise/zenthcloud))
* **cloud_connector:** alias read methods ([2df31d9](https://github.com/skygenesisenterprise/zenthcloud))
* **cloudforce_one:** fix ID typings ([#5556](https://github.com/skygenesisenterprise/zenthcloud)) ([8f30924](https://github.com/skygenesisenterprise/zenthcloud))
* **cloudforce_one:** fix ID typings ([#5558](https://github.com/skygenesisenterprise/zenthcloud)) ([6259852](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** ensure schema docstrings always match the correct schema ([120b0c0](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** more consistent handling of terraform attribute names ([69f06bf](https://github.com/skygenesisenterprise/zenthcloud))
* only unmarshal attributes that exist on the read response schema during refresh ([6521853](https://github.com/skygenesisenterprise/zenthcloud))
* page rule issues ([#5601](https://github.com/skygenesisenterprise/zenthcloud)) ([6316235](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket_event_notification:** add missing queue ID for params ([#5594](https://github.com/skygenesisenterprise/zenthcloud)) ([eae6622](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket_event_notification:** revert incorrect schema update ([#5593](https://github.com/skygenesisenterprise/zenthcloud)) ([e86f933](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket:** fix handling of r2_bucket params ([#5562](https://github.com/skygenesisenterprise/zenthcloud)) ([aa7ba48](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_bucket:** support editing attributes in place ([d0f7581](https://github.com/skygenesisenterprise/zenthcloud))
* **release:** update README and version correctly in release PRs ([5b2c9d1](https://github.com/skygenesisenterprise/zenthcloud))
* **schema:** support ID parameters on post bodies in addition to path params ([11b8aa9](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** Fix refresh behavior and state thrashing ([#5544](https://github.com/skygenesisenterprise/zenthcloud)) ([5c9e166](https://github.com/skygenesisenterprise/zenthcloud))
* **zone_setting:** update model tags to match schema ([#5597](https://github.com/skygenesisenterprise/zenthcloud)) ([624db57](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **build:** update go.mod indirect dependencies ([b808655](https://github.com/skygenesisenterprise/zenthcloud))
* **dep:** bump zenthcloud-go to v4.4.0 ([4c54318](https://github.com/skygenesisenterprise/zenthcloud))
* **grit:** make state replacements more flexible ([94617a7](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([c805fc4](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* generate ([#5557](https://github.com/skygenesisenterprise/zenthcloud)) ([0aba524](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([#5595](https://github.com/skygenesisenterprise/zenthcloud)) ([0c68d86](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([#5602](https://github.com/skygenesisenterprise/zenthcloud)) ([9195f35](https://github.com/skygenesisenterprise/zenthcloud))
* indicate zenthcloud_workers_secret is removed in v5 ([#5539](https://github.com/skygenesisenterprise/zenthcloud)) ([3c4c46c](https://github.com/skygenesisenterprise/zenthcloud))

## 5.4.0 (2025-05-05)

Full Changelog: [v5.3.0...v5.4.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **access_settings:** add CRUD support ([c09313d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9d7422b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([05ee8a1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([550f36a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0897751](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([de87162](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([399bbf5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1a38d89](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f68c333](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([61f2d9b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([99de9f5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4c88979](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([62aca85](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([fb7b3cc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([721c070](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2459c26](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([557a5b7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b126460](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([dba55a3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ea6738b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([db2b0b3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9488f5a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2b58bcb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([56d1121](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([447c889](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([28964ac](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f93d382](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b4c15f2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([46e8465](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6f9426b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5e9f3a7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([94b6154](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9d49cbf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6d3c122](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([880408f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([201b506](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([762cf56](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4058ccb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3996601](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9e54b74](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2521b59](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5103861](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c491f51](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b281833](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7d108ca](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8dc3fc0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a3c6c2e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7fa3ae4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2011650](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a4d240a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([282dfe0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([714c307](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e81a4e1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([afc42a7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([00b46a3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ae3bbc8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e2a069f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([33fea7f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([bd83e14](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a371171](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d01e6cd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([20deac9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b47cdbe](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1836d43](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([74eff88](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f96a024](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([266ab95](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2223159](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([66336c3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b047a2b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b512134](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4cd9d9e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0690194](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b00f257](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ce3313a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([dad5dfb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a52d914](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2e1f93c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1b3f8b8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ab9640a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b636a9b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b6214df](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([54dd3fd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([158af31](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([93729e9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([710186b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4ca4220](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9941fce](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([417f2c5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([bc360d3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d2d7ffd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0b10e03](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([664ee29](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6ee341f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f40bb1a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([30f0f5b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([820bb7b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c85655c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e4f02f7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d0a20d1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e2904bc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([71ff2ca](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([82d7f94](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([04fdbdf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0fb8c9a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9d84121](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([da35236](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d3e4688](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5b74331](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([18b20e4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([960a31b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([112c784](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([633a9db](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b1bf91c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7b69641](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3caf54c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0aa0b76](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6a32178](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5772a3c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([63e9cff](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7520bd1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([81d0f38](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5b962ab](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f1cafb3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e3e392c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2877191](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e5c19c8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3050d3e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([517f362](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e457711](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([de19700](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([87a5428](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5f0b1e1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9e22553](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5396fca](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ee72dee](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2900abb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f320344](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d0e20c0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7c8b299](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d2c5ef0](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0066259](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1e07973](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e5bd521](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([fc9a3bb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a265879](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a799f10](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([358f4cc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1074306](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([37d82a4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5f17801](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([043b87b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([37ee222](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3660d3f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d40f20c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([752c380](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([54c2bff](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([063aabe](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([24fb419](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([88c3bca](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6dc8742](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a589930](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([da51741](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([efaab58](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([edb91c5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([d31d2a8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e89650c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e052d0d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([48d6593](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([70ac208](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1dadd53](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9b8ee5a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8260b16](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([aec76bc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1edded7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c1dcf0e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([805bc1e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a4ba986](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2ba103b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([67bbaf5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8683a24](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4d333dc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([33b7228](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a82390e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([05d8a1f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([235fd9a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([da0d778](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ea7bb97](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9f82224](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([41b6e48](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9fac5b2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0a46f20](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9e31062](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1dc0992](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([076db07](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6bfc29c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a35ded3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([069feef](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f4abe16](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a1da7c3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4b3c5c7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([dcdc16f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a3573be](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7bcc1e8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2aba4fc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([cdc3e81](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([de36903](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([72a58ea](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([72c3076](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([90c4745](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b26ac57](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6530a95](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5aa7243](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ca44eeb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f1a9c7e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e38c3f2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9e52ca7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3459942](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e7491b8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8b14770](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([975f941](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0970ac7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b1be9d8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4629e77](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([db21276](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b482742](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b5d537d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([6efbff3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f0a0485](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2e9b86a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c892255](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ead90dc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([fd96c7d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([57e4d5b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([60f6d29](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([bf60837](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4e2985e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4755978](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7ee28b7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([343dbb4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([27d347d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f2b88bd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2b7e6d6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([57ae57b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8c212a9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([532199e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([69d75d1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5c41b47](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([eb7da9e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f86c697](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ce6d728](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e292d9c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([9210f8f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([4821d8f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e187d08](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8158590](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([5298bb4](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([bd3d354](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f7b0702](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** bump go to 4.3.0 ([1b45f62](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([c3e57cd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([b8e4dc6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** update path placeholders ([ee5d559](https://github.com/skygenesisenterprise/zenthcloud))
* **threat_events:** add list support ([8cad549](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_for_platforms_script_secret:** remove terraform resource ([0327716](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **api:** Fix workers_route identifier attributes ([cf994ae](https://github.com/skygenesisenterprise/zenthcloud))
* **build:** do not fail if go mod tidy fails during bootstrapping ([99c36f3](https://github.com/skygenesisenterprise/zenthcloud))
* **cloud_connector:** dedupe nested fields ([63e0303](https://github.com/skygenesisenterprise/zenthcloud))
* fix caching issue between Unmarshal and UnmarshalComputed ([f253a26](https://github.com/skygenesisenterprise/zenthcloud))
* **resources:** do not refresh resources that have unsupported response types ([febe04e](https://github.com/skygenesisenterprise/zenthcloud))
* **schema:** fix configurability calculation for nested properties without computed values ([428f76b](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** fix `zenthcloud_workers_kv` state refresh ([2e61b3e](https://github.com/skygenesisenterprise/zenthcloud))
* **workers:** rectify bad merge ([6937388](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **ci:** only use depot for staging repos ([ce5dd65](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** run on more branches ([b90e5eb](https://github.com/skygenesisenterprise/zenthcloud))
* **ci:** run on more branches and use depot runners ([0a38714](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** test resource properly supports drift detection ([d3777ed](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_kv:** update acceptance test to use v2 zenthcloud-go client ([d717117](https://github.com/skygenesisenterprise/zenthcloud))

## 5.3.0 (2025-04-09)

Full Changelog: [v5.2.0...v5.3.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **access_policy:** remove invalid defaults ([#5417](https://github.com/skygenesisenterprise/zenthcloud)) ([5f6bec0](https://github.com/skygenesisenterprise/zenthcloud))
* add script to build without optimisations ([#5436](https://github.com/skygenesisenterprise/zenthcloud)) ([d1a4f49](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** Add workers telemetry routes ([828b20e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([13ab544](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([38b779c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([35e5ee6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f8f6637](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e00cc2f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c077795](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([3b8d719](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0497567](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([a5b6d28](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([85ca5b6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([119ea92](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b5b0a8c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([1d07b70](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([72a9f83](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([c4180b7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([cff25d6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([72d3824](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([664cb3c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([44a8c6b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([92919cb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([ac6ab4b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([759abb8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([32c8ef6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([dabc087](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([8611b80](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([7053012](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([45b4ae6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e959fe3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([be9ae70](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([37e7245](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([b3f3126](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([80ac5b7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([f281c3f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([761a96f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2bb8703](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([69ead96](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([e3871a2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([09e6236](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([0be6b20](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([2e1e307](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([78f2553](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([67496e3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5372](https://github.com/skygenesisenterprise/zenthcloud)) ([b940618](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5375](https://github.com/skygenesisenterprise/zenthcloud)) ([a8ea03c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5384](https://github.com/skygenesisenterprise/zenthcloud)) ([d24be4d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5396](https://github.com/skygenesisenterprise/zenthcloud)) ([92c6897](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5408](https://github.com/skygenesisenterprise/zenthcloud)) ([e6b94c8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5426](https://github.com/skygenesisenterprise/zenthcloud)) ([bf1eec3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5430](https://github.com/skygenesisenterprise/zenthcloud)) ([990d99f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5438](https://github.com/skygenesisenterprise/zenthcloud)) ([205c1a1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5442](https://github.com/skygenesisenterprise/zenthcloud)) ([bcb6b61](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5444](https://github.com/skygenesisenterprise/zenthcloud)) ([0c62078](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5447](https://github.com/skygenesisenterprise/zenthcloud)) ([3518fb9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5449](https://github.com/skygenesisenterprise/zenthcloud)) ([a018ca5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5453](https://github.com/skygenesisenterprise/zenthcloud)) ([e914374](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5457](https://github.com/skygenesisenterprise/zenthcloud)) ([369b4be](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5464](https://github.com/skygenesisenterprise/zenthcloud)) ([10dae6c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5465](https://github.com/skygenesisenterprise/zenthcloud)) ([a432bdb](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5467](https://github.com/skygenesisenterprise/zenthcloud)) ([0aee40f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5468](https://github.com/skygenesisenterprise/zenthcloud)) ([95d34e2](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5469](https://github.com/skygenesisenterprise/zenthcloud)) ([d96661d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5470](https://github.com/skygenesisenterprise/zenthcloud)) ([96ea789](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5473](https://github.com/skygenesisenterprise/zenthcloud)) ([f21aa4e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5477](https://github.com/skygenesisenterprise/zenthcloud)) ([7f1a73f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5478](https://github.com/skygenesisenterprise/zenthcloud)) ([e2e5502](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5479](https://github.com/skygenesisenterprise/zenthcloud)) ([1daafb7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** display deprecation messages on resources and attributes ([#5425](https://github.com/skygenesisenterprise/zenthcloud)) ([4a0554e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([02da0fd](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([dc58a0f](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([abd45b1](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([b18b48b](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([27e8929](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([b92b2d7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([2f2436d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** Update workers telemetry route methods ([2b4db81](https://github.com/skygenesisenterprise/zenthcloud))
* **devices:** add registrations support ([05bc7a9](https://github.com/skygenesisenterprise/zenthcloud))
* **docs:** add secrets store to navigation ([b5be043](https://github.com/skygenesisenterprise/zenthcloud))
* **pipelines:** add support ([5068d66](https://github.com/skygenesisenterprise/zenthcloud))
* **secret_store:** add support ([aa76038](https://github.com/skygenesisenterprise/zenthcloud))
* **secrets_store:** remove incorrect bulk edit endpoint ([a8e9411](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **access_policy:** remove invalid defaults ([#5416](https://github.com/skygenesisenterprise/zenthcloud)) ([daaceff](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** handle unordered `policies` ([#5433](https://github.com/skygenesisenterprise/zenthcloud)) ([3f36851](https://github.com/skygenesisenterprise/zenthcloud))
* add deserialization annotations to synthetic ID properties ([#5376](https://github.com/skygenesisenterprise/zenthcloud)) ([754df3f](https://github.com/skygenesisenterprise/zenthcloud))
* **api_token:** handle value across updates ([#5414](https://github.com/skygenesisenterprise/zenthcloud)) ([1db1294](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** better support for environment variables as provider properties ([#5377](https://github.com/skygenesisenterprise/zenthcloud)) ([a6e7785](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** skip generation of update endpoint when only a create endpoint exists ([#5397](https://github.com/skygenesisenterprise/zenthcloud)) ([9b588cb](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** don't include defaults for `data` ([#5461](https://github.com/skygenesisenterprise/zenthcloud)) ([8a5e8ce](https://github.com/skygenesisenterprise/zenthcloud))
* **hostnames:** define correct path parameter for updates ([#5428](https://github.com/skygenesisenterprise/zenthcloud)) ([c54a6a0](https://github.com/skygenesisenterprise/zenthcloud))
* **logpush:** remove empty default value ([#5401](https://github.com/skygenesisenterprise/zenthcloud)) ([0659e1f](https://github.com/skygenesisenterprise/zenthcloud))
* **origin_ca_certificate:** persist values across reads ([#5415](https://github.com/skygenesisenterprise/zenthcloud)) ([1e6d072](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_custom_domain:** add jurisdiction into the schema ([#5404](https://github.com/skygenesisenterprise/zenthcloud)) ([7d2b266](https://github.com/skygenesisenterprise/zenthcloud))
* **ruleset:** handle stricter marshaling ([#5391](https://github.com/skygenesisenterprise/zenthcloud)) ([b9f0292](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_cron_trigger:** remove duplicate struct ([#5435](https://github.com/skygenesisenterprise/zenthcloud)) ([7a54b42](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_for_platforms_script_secret:** correctly update resource name ([#5459](https://github.com/skygenesisenterprise/zenthcloud)) ([e52e4db](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** cleanup placement duplication ([#5437](https://github.com/skygenesisenterprise/zenthcloud)) ([3ac96b6](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd_virtual_networ:** persist `is_default` write only value ([#5434](https://github.com/skygenesisenterprise/zenthcloud)) ([368ab5d](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_tunnel_zenthcloudd:** persist write only values ([#5432](https://github.com/skygenesisenterprise/zenthcloud)) ([7d62813](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **build:** scripts/format should not fail if generate-docs fails ([#5466](https://github.com/skygenesisenterprise/zenthcloud)) ([56b6feb](https://github.com/skygenesisenterprise/zenthcloud))
* **deps:** bump terraform-plugin-docs ([#5399](https://github.com/skygenesisenterprise/zenthcloud)) ([ed4e092](https://github.com/skygenesisenterprise/zenthcloud))
* **deps:** fix indirect updates ([#5402](https://github.com/skygenesisenterprise/zenthcloud)) ([12d9433](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([0d15cfe](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([#5441](https://github.com/skygenesisenterprise/zenthcloud)) ([ec3412b](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([#5443](https://github.com/skygenesisenterprise/zenthcloud)) ([a82d949](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** codegen related update ([#5463](https://github.com/skygenesisenterprise/zenthcloud)) ([d3d4be5](https://github.com/skygenesisenterprise/zenthcloud))
* remove unnecessary `toListParams` methods in singular data sources ([#5371](https://github.com/skygenesisenterprise/zenthcloud)) ([495ae4c](https://github.com/skygenesisenterprise/zenthcloud))
* **tests:** improve enum examples ([#5476](https://github.com/skygenesisenterprise/zenthcloud)) ([225ac31](https://github.com/skygenesisenterprise/zenthcloud))
* update dependencies ([#5387](https://github.com/skygenesisenterprise/zenthcloud)) ([b3bff1d](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* generate ([#5400](https://github.com/skygenesisenterprise/zenthcloud)) ([ecf3561](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([#5429](https://github.com/skygenesisenterprise/zenthcloud)) ([8428f6a](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([#5462](https://github.com/skygenesisenterprise/zenthcloud)) ([80b2588](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([#5480](https://github.com/skygenesisenterprise/zenthcloud)) ([d7e3b84](https://github.com/skygenesisenterprise/zenthcloud))

## 5.2.0 (2025-03-20)

Full Changelog: [v5.1.0...v5.2.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* add docs generation to format script ([#5294](https://github.com/skygenesisenterprise/zenthcloud)) ([a199683](https://github.com/skygenesisenterprise/zenthcloud))
* add SKIP_BREW env var to ./scripts/bootstrap ([#5274](https://github.com/skygenesisenterprise/zenthcloud)) ([45090a9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5243](https://github.com/skygenesisenterprise/zenthcloud)) ([7d287a7](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5249](https://github.com/skygenesisenterprise/zenthcloud)) ([9f253d5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5257](https://github.com/skygenesisenterprise/zenthcloud)) ([220adc9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5265](https://github.com/skygenesisenterprise/zenthcloud)) ([fc3045a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5267](https://github.com/skygenesisenterprise/zenthcloud)) ([c7198d8](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5269](https://github.com/skygenesisenterprise/zenthcloud)) ([3f44f89](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5270](https://github.com/skygenesisenterprise/zenthcloud)) ([56c1da3](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5271](https://github.com/skygenesisenterprise/zenthcloud)) ([b6c093a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5293](https://github.com/skygenesisenterprise/zenthcloud)) ([941a30a](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5295](https://github.com/skygenesisenterprise/zenthcloud)) ([86e4e4e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5299](https://github.com/skygenesisenterprise/zenthcloud)) ([fe8c29d](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5300](https://github.com/skygenesisenterprise/zenthcloud)) ([0abdfcf](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5302](https://github.com/skygenesisenterprise/zenthcloud)) ([063348c](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5309](https://github.com/skygenesisenterprise/zenthcloud)) ([b8674a5](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5325](https://github.com/skygenesisenterprise/zenthcloud)) ([9a65852](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5326](https://github.com/skygenesisenterprise/zenthcloud)) ([5cc7f58](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5332](https://github.com/skygenesisenterprise/zenthcloud)) ([f16b95e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5338](https://github.com/skygenesisenterprise/zenthcloud)) ([6ae5427](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5354](https://github.com/skygenesisenterprise/zenthcloud)) ([98b1ec9](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5355](https://github.com/skygenesisenterprise/zenthcloud)) ([0fb620e](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5356](https://github.com/skygenesisenterprise/zenthcloud)) ([9ca6737](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5357](https://github.com/skygenesisenterprise/zenthcloud)) ([2324e79](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** api update ([#5359](https://github.com/skygenesisenterprise/zenthcloud)) ([5b1c190](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** manual updates ([#5314](https://github.com/skygenesisenterprise/zenthcloud)) ([2660117](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_pages:** add resource ([#5343](https://github.com/skygenesisenterprise/zenthcloud)) ([57d76e2](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_pages:** mark `identifier` as `id` ([#5344](https://github.com/skygenesisenterprise/zenthcloud)) ([9705e1b](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_pages:** mark `identifier` as `id` ([#5345](https://github.com/skygenesisenterprise/zenthcloud)) ([5d1afaa](https://github.com/skygenesisenterprise/zenthcloud))
* **custom_pages:** reintroduce endpoints ([#5312](https://github.com/skygenesisenterprise/zenthcloud)) ([4653c96](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_settings:** fix hierarchy ([#5291](https://github.com/skygenesisenterprise/zenthcloud)) ([cb5bee3](https://github.com/skygenesisenterprise/zenthcloud))
* **dns:** split account and zone DNS settings ([#5283](https://github.com/skygenesisenterprise/zenthcloud)) ([3c9e05e](https://github.com/skygenesisenterprise/zenthcloud))
* **dns:** split account and zone DNS settings ([#5285](https://github.com/skygenesisenterprise/zenthcloud)) ([d669e8f](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** add HA and IO to initialisms ([#5276](https://github.com/skygenesisenterprise/zenthcloud)) ([ead063a](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** bump zenthcloud-go to 4.2.0 ([#5341](https://github.com/skygenesisenterprise/zenthcloud)) ([559850d](https://github.com/skygenesisenterprise/zenthcloud))
* **internal:** revert HA and IO to initialisms ([#5279](https://github.com/skygenesisenterprise/zenthcloud)) ([8cce7e4](https://github.com/skygenesisenterprise/zenthcloud))
* **waiting_rooms:** add account level list API ([#5310](https://github.com/skygenesisenterprise/zenthcloud)) ([915f6f7](https://github.com/skygenesisenterprise/zenthcloud))
* **workers:** add in secrets endpoints ([#5329](https://github.com/skygenesisenterprise/zenthcloud)) ([0d8f363](https://github.com/skygenesisenterprise/zenthcloud))
* **zero_trust_device_*_profile:** mark include and exclude as mutually exclusive ([2db548c](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **accoun_token:** mark `meta` as read only ([84e8c23](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** fix missing model change ([fff0f2c](https://github.com/skygenesisenterprise/zenthcloud))
* **account_token:** handle `value` write only field ([4cbb4b5](https://github.com/skygenesisenterprise/zenthcloud))
* **account:** remove recreation on tenant unit ([76fbb98](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** avoid spurious replacement plans for computed ID properties ([#5244](https://github.com/skygenesisenterprise/zenthcloud)) ([37baea6](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** remove min and max validations in mismatched union variants ([#5263](https://github.com/skygenesisenterprise/zenthcloud)) ([b5f51a0](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_certificate:** handle `private_key` write only field ([78b9ff1](https://github.com/skygenesisenterprise/zenthcloud))
* **authenticated_origin_pulls_certificate:** populate `certificate_id` from the `id` ([2b53245](https://github.com/skygenesisenterprise/zenthcloud))
* **dns_record:** relax constraint for overlapping unions ([ac79ff8](https://github.com/skygenesisenterprise/zenthcloud))
* find-by style data source attributes should share models with plural data sources ([#5251](https://github.com/skygenesisenterprise/zenthcloud)) ([d488159](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_custom_domain:** remove duplicated domain value ([e062813](https://github.com/skygenesisenterprise/zenthcloud))
* **r2_custom_domain:** update path placeholders to de-duplicate internal values ([#5281](https://github.com/skygenesisenterprise/zenthcloud)) ([5ef949d](https://github.com/skygenesisenterprise/zenthcloud))
* **rulesets:** remove unused fields ([dcab45f](https://github.com/skygenesisenterprise/zenthcloud))
* **waiting_rooms:** comment out broken struct for now ([3f89aef](https://github.com/skygenesisenterprise/zenthcloud))
* **workers_script:** re-resolve the correct schemas ([05b25ba](https://github.com/skygenesisenterprise/zenthcloud))


### Chores

* **internal:** codegen related update ([#5286](https://github.com/skygenesisenterprise/zenthcloud)) ([1e603a0](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* generate ([e13aae0](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([9ce87fa](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([b33529e](https://github.com/skygenesisenterprise/zenthcloud))
* generate ([771eaed](https://github.com/skygenesisenterprise/zenthcloud))

## 5.1.0 (2025-02-13)

Full Changelog: [v5.0.0...v5.1.0](https://github.com/skygenesisenterprise/zenthcloud)

### Features

* **api:** disable zero_trust_tunnel_zenthcloudd_token ([#5128](https://github.com/skygenesisenterprise/zenthcloud)) ([df2c3bc](https://github.com/skygenesisenterprise/zenthcloud))
* **api:** enable zero_trust_tunnel_zenthcloudd_token ([#5127](https://github.com/skygenesisenterprise/zenthcloud)) ([1bd200e](https://github.com/skygenesisenterprise/zenthcloud))
* **grit:** add more support for dns_record attributes ([3dbe899](https://github.com/skygenesisenterprise/zenthcloud))
* various codegen changes ([d91aee1](https://github.com/skygenesisenterprise/zenthcloud))


### Bug Fixes

* **grit:** handle inner objects within the object for records ([e7b7bb1](https://github.com/skygenesisenterprise/zenthcloud))
* **grit:** handle inner objects within the object for records ([c9a5257](https://github.com/skygenesisenterprise/zenthcloud))
* **grit:** handle inner objects within the object for records ([ae22af5](https://github.com/skygenesisenterprise/zenthcloud))
* **grit:** make pattern names consistent ([0b2ba12](https://github.com/skygenesisenterprise/zenthcloud))
* update migration guide to use source, not stdlib ([9d208d6](https://github.com/skygenesisenterprise/zenthcloud))
* use correct name for Grit patterns ([2f8d522](https://github.com/skygenesisenterprise/zenthcloud))


### Documentation

* clean out previously set schema_versions ([fba939d](https://github.com/skygenesisenterprise/zenthcloud))
* handle zenthcloud_record data migration ([9eb450b](https://github.com/skygenesisenterprise/zenthcloud))
* regenerate ([bbf53bf](https://github.com/skygenesisenterprise/zenthcloud))
* update deprecation dates ([7a8b7d2](https://github.com/skygenesisenterprise/zenthcloud))
* update page_rules migration guidance ([45e30b1](https://github.com/skygenesisenterprise/zenthcloud))
