// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package client_certificate_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/client_certificate"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestClientCertificateModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*client_certificate.ClientCertificateModel)(nil)
	schema := client_certificate.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
