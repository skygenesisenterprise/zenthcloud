// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_access_infrastructure_target_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_access_infrastructure_target"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustAccessInfrastructureTargetModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_access_infrastructure_target.ZeroTrustAccessInfrastructureTargetModel)(nil)
	schema := zero_trust_access_infrastructure_target.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
