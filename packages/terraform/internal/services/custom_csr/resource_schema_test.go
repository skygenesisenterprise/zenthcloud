// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package custom_csr_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/custom_csr"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCustomCsrModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*custom_csr.CustomCsrModel)(nil)
	schema := custom_csr.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
