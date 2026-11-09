// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package schema_validation_operation_settings_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/schema_validation_operation_settings"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSchemaValidationOperationSettingsModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*schema_validation_operation_settings.SchemaValidationOperationSettingsModel)(nil)
	schema := schema_validation_operation_settings.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
