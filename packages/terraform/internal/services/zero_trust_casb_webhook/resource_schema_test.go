// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_casb_webhook_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_casb_webhook"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustCasbWebhookModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_casb_webhook.ZeroTrustCasbWebhookModel)(nil)
	schema := zero_trust_casb_webhook.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
