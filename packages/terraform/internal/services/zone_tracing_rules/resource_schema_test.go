// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zone_tracing_rules_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zone_tracing_rules"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZoneTracingRulesModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zone_tracing_rules.ZoneTracingRulesModel)(nil)
	schema := zone_tracing_rules.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
