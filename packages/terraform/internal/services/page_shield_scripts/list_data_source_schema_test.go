// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package page_shield_scripts_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/page_shield_scripts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestPageShieldScriptsListDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*page_shield_scripts.PageShieldScriptsListDataSourceModel)(nil)
	schema := page_shield_scripts.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
