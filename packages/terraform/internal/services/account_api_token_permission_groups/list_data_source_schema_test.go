// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package account_api_token_permission_groups_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/account_api_token_permission_groups"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAccountAPITokenPermissionGroupsListDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*account_api_token_permission_groups.AccountAPITokenPermissionGroupsListDataSourceModel)(nil)
	schema := account_api_token_permission_groups.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
