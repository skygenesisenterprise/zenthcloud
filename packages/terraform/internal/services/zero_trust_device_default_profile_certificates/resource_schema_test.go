// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_device_default_profile_certificates_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_device_default_profile_certificates"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDeviceDefaultProfileCertificatesModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_device_default_profile_certificates.ZeroTrustDeviceDefaultProfileCertificatesModel)(nil)
	schema := zero_trust_device_default_profile_certificates.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
