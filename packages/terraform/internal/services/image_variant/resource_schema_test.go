// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package image_variant_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/image_variant"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestImageVariantModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*image_variant.ImageVariantModel)(nil)
	schema := image_variant.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
