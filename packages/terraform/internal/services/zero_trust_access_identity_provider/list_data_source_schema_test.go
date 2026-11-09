// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_access_identity_provider_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_access_identity_provider"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustAccessIdentityProvidersDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_access_identity_provider.ZeroTrustAccessIdentityProvidersDataSourceModel)(nil)
	schema := zero_trust_access_identity_provider.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
