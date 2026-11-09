package v500

import (
	"context"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/migrations"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

// MoveArgoToTieredCaching handles moving state from legacy zenthcloud_argo to zenthcloud_argo_tiered_caching.
// This is triggered by Terraform 1.8+ when it encounters a `moved` block:
//
//	moved {
//	  from = zenthcloud_argo.example
//	  to   = zenthcloud_argo_tiered_caching.example
//	}
//
// This handler is called when:
// - Scenario 4: Only tiered_caching attribute exists (no smart_routing)
//
// For all other scenarios, the moved block points to zenthcloud_argo_smart_routing instead.
func MoveArgoToTieredCaching(ctx context.Context, req resource.MoveStateRequest, resp *resource.MoveStateResponse) {
	tflog.Info(ctx, "Moving state from legacy zenthcloud_argo to zenthcloud_argo_tiered_caching")

	// Parse the source state (legacy v4 zenthcloud_argo format)
	var sourceState SourceZenthcloudArgoModel
	if migrations.DiagnoseMoveStateNilSourceState(req, resp) {
		return
	}
	resp.Diagnostics.Append(req.SourceState.Get(ctx, &sourceState)...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Transform to target (current v5 zenthcloud_argo_tiered_caching format)
	targetState, diags := TransformArgoToTieredCaching(ctx, sourceState)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Set the moved state
	resp.Diagnostics.Append(resp.TargetState.Set(ctx, targetState)...)

	tflog.Info(ctx, "State move from legacy zenthcloud_argo to zenthcloud_argo_tiered_caching completed successfully")
}
