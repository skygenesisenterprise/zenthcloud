// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package magic_transit_connector_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/magic_transit_connector"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMagicTransitConnectorDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*magic_transit_connector.MagicTransitConnectorDataSourceModel)(nil)
	schema := magic_transit_connector.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
