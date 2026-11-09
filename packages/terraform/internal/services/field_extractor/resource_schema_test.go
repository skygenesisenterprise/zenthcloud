// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package field_extractor_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/field_extractor"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestFieldExtractorModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*field_extractor.FieldExtractorModel)(nil)
	schema := field_extractor.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
