// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package origin_ca_certificate_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/origin_ca_certificate"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestOriginCACertificatesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*origin_ca_certificate.OriginCACertificatesDataSourceModel)(nil)
	schema := origin_ca_certificate.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
