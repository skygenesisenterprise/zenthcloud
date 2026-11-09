// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package access_rule_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/access_rule"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAccessRuleModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*access_rule.AccessRuleModel)(nil)
	schema := access_rule.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
