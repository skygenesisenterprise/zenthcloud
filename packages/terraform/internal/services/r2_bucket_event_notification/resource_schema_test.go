// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package r2_bucket_event_notification_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/r2_bucket_event_notification"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestR2BucketEventNotificationModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*r2_bucket_event_notification.R2BucketEventNotificationModel)(nil)
	schema := r2_bucket_event_notification.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
