// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package share_resource_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/share_resource"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestShareResourcesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*share_resource.ShareResourcesDataSourceModel)(nil)
	schema := share_resource.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
