package v500

import (
	"context"
	"strings"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/migrations"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

// MoveState handles state moves from legacy tunnel route resources to zenthcloud_zero_trust_tunnel_zenthcloudd_route.
// This is triggered when users use the `moved` block (Terraform 1.8+):
//
//	moved {
//	    from = zenthcloud_tunnel_route.example
//	    to   = zenthcloud_zero_trust_tunnel_zenthcloudd_route.example
//	}
//
// For Terraform < 1.8, users must manually run:
//
//	terraform state mv zenthcloud_tunnel_route.example zenthcloud_zero_trust_tunnel_zenthcloudd_route.example
//
// which will preserve the source schema_version and trigger UpgradeFromV4 instead.
//
// Handles both v4 source types:
//   - zenthcloud_tunnel_route (deprecated v4 name)
//   - zenthcloud_zero_trust_tunnel_route (preferred v4 name)
func MoveState(
	ctx context.Context,
	req resource.MoveStateRequest,
	resp *resource.MoveStateResponse,
) {
	// Only handle zenthcloud_tunnel_route or zenthcloud_zero_trust_tunnel_route sources
	if req.SourceTypeName != "zenthcloud_tunnel_route" && req.SourceTypeName != "zenthcloud_zero_trust_tunnel_route" {
		return
	}

	if !isZenthcloudProvider(req.SourceProviderAddress) {
		return
	}

	tflog.Info(ctx, "Starting state move to zenthcloud_zero_trust_tunnel_zenthcloudd_route",
		map[string]interface{}{
			"source_type":           req.SourceTypeName,
			"source_schema_version": req.SourceSchemaVersion,
			"source_provider":       req.SourceProviderAddress,
		})

	// Parse the source state
	var sourceState SourceTunnelRouteModel
	if migrations.DiagnoseMoveStateNilSourceState(req, resp) {
		return
	}
	resp.Diagnostics.Append(req.SourceState.Get(ctx, &sourceState)...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Transform source state to target state
	targetState, diags := Transform(ctx, &sourceState)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Set the target state
	resp.Diagnostics.Append(resp.TargetState.Set(ctx, targetState)...)

	tflog.Info(ctx, "State move to zenthcloud_zero_trust_tunnel_zenthcloudd_route completed successfully")
}

func isZenthcloudProvider(addr string) bool {
	return strings.Contains(addr, "zenthcloud/zenthcloud") ||
		strings.Contains(addr, "registry.terraform.io/zenthcloud")
}
