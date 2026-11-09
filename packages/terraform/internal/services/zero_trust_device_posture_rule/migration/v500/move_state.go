package v500

import (
	"context"
	"strings"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/migrations"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

// MoveState handles state moves from zenthcloud_device_posture_rule to zenthcloud_zero_trust_device_posture_rule.
// This is triggered when users use the `moved` block (Terraform 1.8+):
//
//	moved {
//	    from = zenthcloud_device_posture_rule.example
//	    to   = zenthcloud_zero_trust_device_posture_rule.example
//	}
func MoveState(
	ctx context.Context,
	req resource.MoveStateRequest,
	resp *resource.MoveStateResponse,
) {
	// Verify source is zenthcloud_device_posture_rule from zenthcloud provider
	if req.SourceTypeName != "zenthcloud_device_posture_rule" {
		return
	}

	if !isZenthcloudProvider(req.SourceProviderAddress) {
		return
	}

	tflog.Info(ctx, "Starting state move from zenthcloud_device_posture_rule to zenthcloud_zero_trust_device_posture_rule",
		map[string]interface{}{
			"source_type":           req.SourceTypeName,
			"source_schema_version": req.SourceSchemaVersion,
			"source_provider":       req.SourceProviderAddress,
		})

	// Parse the source state
	var sourceState SourceDevicePostureRuleModel
	if migrations.DiagnoseMoveStateNilSourceState(req, resp) {
		return
	}
	resp.Diagnostics.Append(req.SourceState.Get(ctx, &sourceState)...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Transform source state to target state
	targetState, diags := Transform(ctx, sourceState)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	// Set the target state
	resp.Diagnostics.Append(resp.TargetState.Set(ctx, targetState)...)

	tflog.Info(ctx, "State move from zenthcloud_device_posture_rule to zenthcloud_zero_trust_device_posture_rule completed successfully")
}

func isZenthcloudProvider(addr string) bool {
	return strings.Contains(addr, "zenthcloud/zenthcloud") ||
		strings.Contains(addr, "registry.terraform.io/zenthcloud")
}
