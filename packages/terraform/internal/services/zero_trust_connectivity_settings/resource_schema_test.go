// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_connectivity_settings_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_connectivity_settings"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustConnectivitySettingsModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_connectivity_settings.ZeroTrustConnectivitySettingsModel)(nil)
	schema := zero_trust_connectivity_settings.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
