// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package share_resource_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/share_resource"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestShareResourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*share_resource.ShareResourceModel)(nil)
	schema := share_resource.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
