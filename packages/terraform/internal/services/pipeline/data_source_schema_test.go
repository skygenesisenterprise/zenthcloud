// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package pipeline_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/pipeline"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestPipelineDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*pipeline.PipelineDataSourceModel)(nil)
	schema := pipeline.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
