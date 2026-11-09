// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package custom_pages_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/custom_pages"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCustomPagesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*custom_pages.CustomPagesDataSourceModel)(nil)
	schema := custom_pages.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
