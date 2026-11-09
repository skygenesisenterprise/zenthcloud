// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package api_token_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/api_token"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAPITokenModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*api_token.APITokenModel)(nil)
	schema := api_token.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
