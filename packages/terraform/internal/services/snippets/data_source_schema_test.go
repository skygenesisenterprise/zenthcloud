// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package snippets_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/snippets"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSnippetsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*snippets.SnippetsDataSourceModel)(nil)
	schema := snippets.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
