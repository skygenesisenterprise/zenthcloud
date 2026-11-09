// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package list_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/list"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestListDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*list.ListDataSourceModel)(nil)
	schema := list.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
