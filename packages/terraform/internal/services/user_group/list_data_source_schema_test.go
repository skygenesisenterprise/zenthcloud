// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package user_group_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/user_group"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestUserGroupsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*user_group.UserGroupsDataSourceModel)(nil)
	schema := user_group.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
