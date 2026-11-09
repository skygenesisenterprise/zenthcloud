// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package magic_transit_site_lan_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/magic_transit_site_lan"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMagicTransitSiteLANDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*magic_transit_site_lan.MagicTransitSiteLANDataSourceModel)(nil)
	schema := magic_transit_site_lan.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
