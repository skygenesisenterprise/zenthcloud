// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package token_validation_rules_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/token_validation_rules"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestTokenValidationRulesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*token_validation_rules.TokenValidationRulesDataSourceModel)(nil)
	schema := token_validation_rules.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
