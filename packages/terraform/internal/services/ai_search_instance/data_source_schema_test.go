// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ai_search_instance_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/ai_search_instance"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAISearchInstanceDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*ai_search_instance.AISearchInstanceDataSourceModel)(nil)
	schema := ai_search_instance.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
