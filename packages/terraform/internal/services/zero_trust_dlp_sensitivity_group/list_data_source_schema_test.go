// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_dlp_sensitivity_group_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_dlp_sensitivity_group"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDLPSensitivityGroupsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_dlp_sensitivity_group.ZeroTrustDLPSensitivityGroupsDataSourceModel)(nil)
	schema := zero_trust_dlp_sensitivity_group.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
