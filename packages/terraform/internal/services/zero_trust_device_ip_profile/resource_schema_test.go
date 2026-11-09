// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_device_ip_profile_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_device_ip_profile"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDeviceIPProfileModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_device_ip_profile.ZeroTrustDeviceIPProfileModel)(nil)
	schema := zero_trust_device_ip_profile.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
