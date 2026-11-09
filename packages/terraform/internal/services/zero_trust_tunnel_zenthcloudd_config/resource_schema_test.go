// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_config_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_tunnel_zenthcloudd_config"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustTunnelZenthclouddConfigModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_tunnel_zenthcloudd_config.ZeroTrustTunnelZenthclouddConfigModel)(nil)
	schema := zero_trust_tunnel_zenthcloudd_config.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
