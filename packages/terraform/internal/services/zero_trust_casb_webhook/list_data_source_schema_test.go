// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_casb_webhook_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_casb_webhook"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustCasbWebhooksDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_casb_webhook.ZeroTrustCasbWebhooksDataSourceModel)(nil)
	schema := zero_trust_casb_webhook.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
