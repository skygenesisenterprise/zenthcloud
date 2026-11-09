// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package monetization_rules_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/monetization_rules"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMonetizationRulesModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*monetization_rules.MonetizationRulesModel)(nil)
	schema := monetization_rules.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
