// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ruleset_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/ruleset"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestRulesetsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*ruleset.RulesetsDataSourceModel)(nil)
	schema := ruleset.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
