// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_network_hostname_route_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_network_hostname_route"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustNetworkHostnameRouteModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_network_hostname_route.ZeroTrustNetworkHostnameRouteModel)(nil)
	schema := zero_trust_network_hostname_route.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
