// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ai_search_namespace_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/ai_search_namespace"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAISearchNamespaceDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*ai_search_namespace.AISearchNamespaceDataSourceModel)(nil)
	schema := ai_search_namespace.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
