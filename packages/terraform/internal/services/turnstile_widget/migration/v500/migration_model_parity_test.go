// This file is intentionally NOT code-generated.
// It ensures the migration target model stays in sync with the live resource schema.
// If a field is added to the live model/schema without being added to the migration
// Target struct, this test will fail, catching the drift in CI before it causes a
// runtime panic.

package v500_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/turnstile_widget"
	v500 "github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/turnstile_widget/migration/v500"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

// TestTurnstileWidgetMigrationModelSchemaParity verifies that TargetTurnstileWidgetModel
// (used in UpgradeFromV4 → resp.State.Set) stays in sync with the live ResourceSchema.
func TestTurnstileWidgetMigrationModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*v500.TargetTurnstileWidgetModel)(nil)
	schema := turnstile_widget.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateMigrationModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
