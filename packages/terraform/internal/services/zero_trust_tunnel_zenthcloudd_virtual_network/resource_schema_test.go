// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_virtual_network_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_tunnel_zenthcloudd_virtual_network"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustTunnelZenthclouddVirtualNetworkModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_tunnel_zenthcloudd_virtual_network.ZeroTrustTunnelZenthclouddVirtualNetworkModel)(nil)
	schema := zero_trust_tunnel_zenthcloudd_virtual_network.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
