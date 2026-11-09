// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package custom_page_asset_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/custom_page_asset"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCustomPageAssetModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*custom_page_asset.CustomPageAssetModel)(nil)
	schema := custom_page_asset.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
