// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_warp_connector_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_tunnel_warp_connector"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustTunnelWARPConnectorModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_tunnel_warp_connector.ZeroTrustTunnelWARPConnectorModel)(nil)
	schema := zero_trust_tunnel_warp_connector.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
