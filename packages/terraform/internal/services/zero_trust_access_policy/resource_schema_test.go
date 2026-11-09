// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_access_policy_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_access_policy"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustAccessPolicyModelSchemaParity(t *testing.T) {
	t.Skip("page rules has too much custom code to have parity")
	t.Parallel()
	model := (*zero_trust_access_policy.ZeroTrustAccessPolicyModel)(nil)
	schema := zero_trust_access_policy.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
