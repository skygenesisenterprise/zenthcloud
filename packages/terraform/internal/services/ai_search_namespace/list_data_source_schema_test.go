// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ai_search_namespace_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/ai_search_namespace"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAISearchNamespacesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*ai_search_namespace.AISearchNamespacesDataSourceModel)(nil)
	schema := ai_search_namespace.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
