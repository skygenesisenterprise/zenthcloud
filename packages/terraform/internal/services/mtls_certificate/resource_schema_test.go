// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package mtls_certificate_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/mtls_certificate"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestMTLSCertificateModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*mtls_certificate.MTLSCertificateModel)(nil)
	schema := mtls_certificate.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
