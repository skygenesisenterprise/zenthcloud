// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package schema_validation_operation_settings_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/schema_validation_operation_settings"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSchemaValidationOperationSettingsListDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*schema_validation_operation_settings.SchemaValidationOperationSettingsListDataSourceModel)(nil)
	schema := schema_validation_operation_settings.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
