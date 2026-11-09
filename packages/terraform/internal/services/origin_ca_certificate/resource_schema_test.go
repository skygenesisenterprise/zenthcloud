// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package origin_ca_certificate_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/origin_ca_certificate"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestOriginCACertificateModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*origin_ca_certificate.OriginCACertificateModel)(nil)
	schema := origin_ca_certificate.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
