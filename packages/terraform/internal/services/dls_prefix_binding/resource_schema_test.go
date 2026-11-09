// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package dls_prefix_binding_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/dls_prefix_binding"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestDLSPrefixBindingModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*dls_prefix_binding.DLSPrefixBindingModel)(nil)
	schema := dls_prefix_binding.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
