// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package magic_wan_static_route_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/magic_wan_static_route"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMagicWANStaticRouteModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*magic_wan_static_route.MagicWANStaticRouteModel)(nil)
	schema := magic_wan_static_route.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
