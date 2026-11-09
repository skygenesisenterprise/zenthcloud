// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package bot_management_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/bot_management"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestBotManagementModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*bot_management.BotManagementModel)(nil)
	schema := bot_management.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
