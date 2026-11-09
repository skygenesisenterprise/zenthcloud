// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package account_permission_group_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/account_permission_group"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAccountPermissionGroupsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*account_permission_group.AccountPermissionGroupsDataSourceModel)(nil)
	schema := account_permission_group.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
