// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package pipeline_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/pipeline"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestPipelineModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*pipeline.PipelineModel)(nil)
	schema := pipeline.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
