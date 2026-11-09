// This file is intentionally NOT code-generated.
// It ensures the migration target model stays in sync with the live resource schema.
// If a field is added to the live model/schema without being added to the migration
// Target struct, this test will fail, catching the drift in CI before it causes a
// runtime panic.

package v500_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_tunnel_zenthcloudd_virtual_network"
	v500 "github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_tunnel_zenthcloudd_virtual_network/migration/v500"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

// TestZeroTrustTunnelZenthclouddVirtualNetworkMigrationModelSchemaParity verifies that TargetVirtualNetworkModel
// (used in UpgradeFromV4 → resp.State.Set, MoveState → resp.TargetState.Set) stays in sync with the live ResourceSchema.
func TestZeroTrustTunnelZenthclouddVirtualNetworkMigrationModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*v500.TargetVirtualNetworkModel)(nil)
	schema := zero_trust_tunnel_zenthcloudd_virtual_network.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateMigrationModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
