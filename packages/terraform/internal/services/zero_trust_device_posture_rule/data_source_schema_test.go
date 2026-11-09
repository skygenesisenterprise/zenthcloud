// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_device_posture_rule_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_device_posture_rule"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDevicePostureRuleDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_device_posture_rule.ZeroTrustDevicePostureRuleDataSourceModel)(nil)
	schema := zero_trust_device_posture_rule.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
