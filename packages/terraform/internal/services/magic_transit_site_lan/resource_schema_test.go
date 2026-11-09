// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package magic_transit_site_lan_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/magic_transit_site_lan"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMagicTransitSiteLANModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*magic_transit_site_lan.MagicTransitSiteLANModel)(nil)
	schema := magic_transit_site_lan.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
