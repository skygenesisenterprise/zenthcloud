// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package account_token_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/account_token"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAccountTokenDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*account_token.AccountTokenDataSourceModel)(nil)
	schema := account_token.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
