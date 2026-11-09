package v500

import (
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
)

// SourceZenthcloudQueueSchema returns the legacy zenthcloud_queue schema (schema_version=0).
// This is used by UpgradeFromLegacyV0 to parse state from the legacy SDKv2 provider.
// Reference: https://github.com/skygenesisenterprise/zenthcloud
func SourceZenthcloudQueueSchema() schema.Schema {
	return schema.Schema{
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Computed: true,
			},
			"account_id": schema.StringAttribute{
				Required: true,
			},
			// Source uses "name", target uses "queue_name"
			"name": schema.StringAttribute{
				Required: true,
			},
		},
	}
}
