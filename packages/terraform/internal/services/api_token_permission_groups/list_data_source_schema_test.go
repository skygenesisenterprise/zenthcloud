// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package api_token_permission_groups_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/api_token_permission_groups"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAPITokenPermissionGroupsListDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*api_token_permission_groups.APITokenPermissionGroupsListDataSourceModel)(nil)
	schema := api_token_permission_groups.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
