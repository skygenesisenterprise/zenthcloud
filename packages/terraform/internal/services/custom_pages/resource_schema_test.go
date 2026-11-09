// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package custom_pages_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/custom_pages"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCustomPagesModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*custom_pages.CustomPagesModel)(nil)
	schema := custom_pages.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
