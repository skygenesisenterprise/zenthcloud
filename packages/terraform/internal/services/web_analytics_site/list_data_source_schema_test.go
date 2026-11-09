// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package web_analytics_site_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/web_analytics_site"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestWebAnalyticsSitesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*web_analytics_site.WebAnalyticsSitesDataSourceModel)(nil)
	schema := web_analytics_site.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
