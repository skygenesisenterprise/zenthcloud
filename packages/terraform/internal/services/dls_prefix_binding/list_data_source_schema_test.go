// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package dls_prefix_binding_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/dls_prefix_binding"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestDLSPrefixBindingsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*dls_prefix_binding.DLSPrefixBindingsDataSourceModel)(nil)
	schema := dls_prefix_binding.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
