// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package token_validation_rules_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/token_validation_rules"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestTokenValidationRulesListDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*token_validation_rules.TokenValidationRulesListDataSourceModel)(nil)
	schema := token_validation_rules.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
