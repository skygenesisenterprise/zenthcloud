// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package notification_policy_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/notification_policy"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestNotificationPolicyModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*notification_policy.NotificationPolicyModel)(nil)
	schema := notification_policy.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
