// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zone_dnssec_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zone_dnssec"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZoneDNSSECDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zone_dnssec.ZoneDNSSECDataSourceModel)(nil)
	schema := zone_dnssec.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
