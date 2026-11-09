// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_dlp_sensitivity_level_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_dlp_sensitivity_level"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDLPSensitivityLevelModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_dlp_sensitivity_level.ZeroTrustDLPSensitivityLevelModel)(nil)
	schema := zero_trust_dlp_sensitivity_level.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
