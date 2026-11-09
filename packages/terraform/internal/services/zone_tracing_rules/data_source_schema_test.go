// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zone_tracing_rules_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zone_tracing_rules"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZoneTracingRulesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zone_tracing_rules.ZoneTracingRulesDataSourceModel)(nil)
	schema := zone_tracing_rules.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
