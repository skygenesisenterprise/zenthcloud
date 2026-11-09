// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package content_scanning_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/content_scanning"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestContentScanningDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*content_scanning.ContentScanningDataSourceModel)(nil)
	schema := content_scanning.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
