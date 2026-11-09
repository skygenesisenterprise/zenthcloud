// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_access_mtls_hostname_settings_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_access_mtls_hostname_settings"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustAccessMTLSHostnameSettingsModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_access_mtls_hostname_settings.ZeroTrustAccessMTLSHostnameSettingsModel)(nil)
	schema := zero_trust_access_mtls_hostname_settings.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
