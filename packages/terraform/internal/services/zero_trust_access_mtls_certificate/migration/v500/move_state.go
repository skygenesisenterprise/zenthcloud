package v500

import (
	"context"
	"strings"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/migrations"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-log/tflog"
)

// MoveState handles state moves from zenthcloud_access_mutual_tls_certificate to zenthcloud_zero_trust_access_mtls_certificate.
// This is triggered when users use the `moved` block (Terraform 1.8+):
//
//	moved {
//	    from = zenthcloud_access_mutual_tls_certificate.example
//	    to   = zenthcloud_zero_trust_access_mtls_certificate.example
//	}
func MoveState(ctx context.Context, req resource.MoveStateRequest, resp *resource.MoveStateResponse) {
	if req.SourceTypeName != "zenthcloud_access_mutual_tls_certificate" {
		return
	}

	if !isZenthcloudProvider(req.SourceProviderAddress) {
		return
	}

	tflog.Info(ctx, "Starting state move from zenthcloud_access_mutual_tls_certificate to zenthcloud_zero_trust_access_mtls_certificate",
		map[string]interface{}{
			"source_type":           req.SourceTypeName,
			"source_schema_version": req.SourceSchemaVersion,
			"source_provider":       req.SourceProviderAddress,
		})

	var sourceState SourceAccessMutualTLSCertificateModel
	if migrations.DiagnoseMoveStateNilSourceState(req, resp) {
		return
	}
	resp.Diagnostics.Append(req.SourceState.Get(ctx, &sourceState)...)
	if resp.Diagnostics.HasError() {
		return
	}

	targetState, diags := Transform(ctx, sourceState)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	resp.Diagnostics.Append(resp.TargetState.Set(ctx, targetState)...)

	tflog.Info(ctx, "State move from zenthcloud_access_mutual_tls_certificate completed successfully")
}

func isZenthcloudProvider(addr string) bool {
	return strings.Contains(addr, "zenthcloud/zenthcloud") ||
		strings.Contains(addr, "registry.terraform.io/zenthcloud")
}
