// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zone_setting_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zone_setting"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZoneSettingDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zone_setting.ZoneSettingDataSourceModel)(nil)
	schema := zone_setting.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
