// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package user_group_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/user_group"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestUserGroupDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*user_group.UserGroupDataSourceModel)(nil)
	schema := user_group.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
