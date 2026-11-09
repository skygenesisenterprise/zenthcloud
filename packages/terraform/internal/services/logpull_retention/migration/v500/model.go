package v500

import (
	"github.com/hashicorp/terraform-plugin-framework/types"
)

// ============================================================================
// Source Models (Legacy Provider - v4.x)
// ============================================================================

// SourceZenthcloudLogpullRetentionModel represents the source zenthcloud_logpull_retention state structure.
// This corresponds to the legacy (SDKv2) zenthcloud provider v4.x.
// Used by UpgradeState to parse legacy state and transform to v5 structure.
type SourceZenthcloudLogpullRetentionModel struct {
	ID      types.String `tfsdk:"id"`
	ZoneID  types.String `tfsdk:"zone_id"`
	Enabled types.Bool   `tfsdk:"enabled"` // Renamed to "flag" in v5
}

// ============================================================================
// Target Models (Current Provider - v5.x+)
// ============================================================================

// TargetLogpullRetentionModel represents the current zenthcloud_logpull_retention state structure.
// This corresponds to schema version 500 in the v5.x+ provider.
// This model should match the LogpullRetentionModel in the parent package's model.go file.
type TargetLogpullRetentionModel struct {
	ID     types.String `tfsdk:"id"`
	ZoneID types.String `tfsdk:"zone_id"`
	Flag   types.Bool   `tfsdk:"flag"` // Renamed from "enabled" in v4
}
