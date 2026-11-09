// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package magic_transit_cf1_site_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/magic_transit_cf1_site"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMagicTransitCf1SitesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*magic_transit_cf1_site.MagicTransitCf1SitesDataSourceModel)(nil)
	schema := magic_transit_cf1_site.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
