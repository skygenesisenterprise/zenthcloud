// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package account_dns_settings_internal_view_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/account_dns_settings_internal_view"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAccountDNSSettingsInternalViewModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*account_dns_settings_internal_view.AccountDNSSettingsInternalViewModel)(nil)
	schema := account_dns_settings_internal_view.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
