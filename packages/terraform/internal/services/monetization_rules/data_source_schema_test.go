// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package monetization_rules_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/monetization_rules"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMonetizationRulesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*monetization_rules.MonetizationRulesDataSourceModel)(nil)
	schema := monetization_rules.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
