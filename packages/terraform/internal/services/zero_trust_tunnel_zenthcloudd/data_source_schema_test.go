// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_tunnel_zenthcloudd"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustTunnelZenthclouddDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_tunnel_zenthcloudd.ZeroTrustTunnelZenthclouddDataSourceModel)(nil)
	schema := zero_trust_tunnel_zenthcloudd.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
