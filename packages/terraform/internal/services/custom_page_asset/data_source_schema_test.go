// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package custom_page_asset_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/custom_page_asset"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCustomPageAssetDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*custom_page_asset.CustomPageAssetDataSourceModel)(nil)
	schema := custom_page_asset.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
