// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ai_gateway_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/ai_gateway"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAIGatewaysDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*ai_gateway.AIGatewaysDataSourceModel)(nil)
	schema := ai_gateway.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
