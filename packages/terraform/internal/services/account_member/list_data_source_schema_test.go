// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package account_member_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/account_member"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAccountMembersDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*account_member.AccountMembersDataSourceModel)(nil)
	schema := account_member.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
