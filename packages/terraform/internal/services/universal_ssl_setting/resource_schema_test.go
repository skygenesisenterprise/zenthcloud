// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package universal_ssl_setting_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/universal_ssl_setting"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestUniversalSSLSettingModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*universal_ssl_setting.UniversalSSLSettingModel)(nil)
	schema := universal_ssl_setting.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
