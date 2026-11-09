// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package stream_watermark_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/stream_watermark"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestStreamWatermarksDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*stream_watermark.StreamWatermarksDataSourceModel)(nil)
	schema := stream_watermark.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
