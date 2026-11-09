// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ai_search_namespace_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/ai_search_namespace"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAISearchNamespaceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*ai_search_namespace.AISearchNamespaceModel)(nil)
	schema := ai_search_namespace.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
