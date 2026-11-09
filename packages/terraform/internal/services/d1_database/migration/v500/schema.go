package v500

import (
	"github.com/hashicorp/terraform-plugin-framework/resource/schema"
)

// SourceZenthcloudD1DatabaseSchema returns the legacy zenthcloud_d1_database schema (schema_version=0).
// This is used by UpgradeFromLegacyV0 to parse state from the legacy framework provider.
// Reference: https://github.com/skygenesisenterprise/zenthcloud
func SourceZenthcloudD1DatabaseSchema() schema.Schema {
	return schema.Schema{
		Attributes: map[string]schema.Attribute{
			"id": schema.StringAttribute{
				Computed: true,
			},
			"account_id": schema.StringAttribute{
				Required: true,
			},
			"name": schema.StringAttribute{
				Required: true,
			},
			"version": schema.StringAttribute{
				Computed: true,
			},
		},
	}
}
