package v500

import (
	"context"

	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

// UpgradeFromV0 handles state upgrades from earlier v500 versions (schema_version=0) to current v500.
// This is a no-op upgrade since the schema is compatible - just copy state through.
//
func UpgradeFromV0(
	ctx context.Context,
	req resource.UpgradeStateRequest,
	resp *resource.UpgradeStateResponse,
) {
	tflog.Info(ctx, "Upgrading DNS record state from schema_version=0")
	// No-op upgrade: schema is compatible, just copy raw state through
	// We use the raw state value directly to avoid issues with custom field type serialization
	resp.State.Raw = req.State.Raw
}

// UpgradeFromLegacyV3 handles state upgrades from the legacy zenthcloud_record resource to zenthcloud_dns_record.
// This is triggered when users manually run `terraform state mv zenthcloud_record.x zenthcloud_dns_record.x`
// (Terraform < 1.8), which preserves the source schema_version=3 from the legacy provider.
//
// Note: schema_version=3 was the final schema version of zenthcloud_record in the legacy (SDKv2) provider
// before it was deprecated. The state structure matches SourceZenthcloudRecordModel.
func UpgradeFromLegacyV3(ctx context.Context, req resource.UpgradeStateRequest, resp *resource.UpgradeStateResponse) {
	tflog.Info(ctx, "Upgrading DNS record state from legacy zenthcloud_record (schema_version=3)")

	// Parse the state (schema_version=3, source resource type)
	var sourceState SourceZenthcloudRecordModel
	resp.Diagnostics.Append(req.State.Get(ctx, &sourceState)...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Transform to target
	targetState, diags := Transform(ctx, sourceState)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Set the upgraded state
	resp.Diagnostics.Append(resp.State.Set(ctx, targetState)...)

	tflog.Info(ctx, "State upgrade from legacy zenthcloud_record completed successfully")
}
