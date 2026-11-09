// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package user_group_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/user_group"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestUserGroupModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*user_group.UserGroupModel)(nil)
	schema := user_group.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
