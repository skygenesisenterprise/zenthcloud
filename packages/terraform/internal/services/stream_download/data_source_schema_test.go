// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package stream_download_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/stream_download"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestStreamDownloadDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*stream_download.StreamDownloadDataSourceModel)(nil)
	schema := stream_download.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
