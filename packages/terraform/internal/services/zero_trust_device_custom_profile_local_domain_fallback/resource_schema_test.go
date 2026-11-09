// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_device_custom_profile_local_domain_fallback_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_device_custom_profile_local_domain_fallback"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDeviceCustomProfileLocalDomainFallbackModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_device_custom_profile_local_domain_fallback.ZeroTrustDeviceCustomProfileLocalDomainFallbackModel)(nil)
	schema := zero_trust_device_custom_profile_local_domain_fallback.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
