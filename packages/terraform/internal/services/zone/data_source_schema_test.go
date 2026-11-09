// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zone_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zone"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZoneDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zone.ZoneDataSourceModel)(nil)
	schema := zone.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
