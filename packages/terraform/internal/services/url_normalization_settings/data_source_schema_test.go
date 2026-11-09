// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package url_normalization_settings_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/url_normalization_settings"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestURLNormalizationSettingsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*url_normalization_settings.URLNormalizationSettingsDataSourceModel)(nil)
	schema := url_normalization_settings.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
