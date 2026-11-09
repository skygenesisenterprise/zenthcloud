// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package spectrum_protocol_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/spectrum_protocol"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSpectrumProtocolsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*spectrum_protocol.SpectrumProtocolsDataSourceModel)(nil)
	schema := spectrum_protocol.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
