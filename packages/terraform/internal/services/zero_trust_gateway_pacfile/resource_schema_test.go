// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_gateway_pacfile_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_gateway_pacfile"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustGatewayPacfileModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_gateway_pacfile.ZeroTrustGatewayPacfileModel)(nil)
	schema := zero_trust_gateway_pacfile.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
