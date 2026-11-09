// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ct_alerting_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/ct_alerting"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCTAlertingDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*ct_alerting.CTAlertingDataSourceModel)(nil)
	schema := ct_alerting.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
