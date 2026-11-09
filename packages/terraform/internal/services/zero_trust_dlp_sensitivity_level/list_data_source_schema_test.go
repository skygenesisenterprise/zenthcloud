// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_dlp_sensitivity_level_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_dlp_sensitivity_level"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDLPSensitivityLevelsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_dlp_sensitivity_level.ZeroTrustDLPSensitivityLevelsDataSourceModel)(nil)
	schema := zero_trust_dlp_sensitivity_level.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
