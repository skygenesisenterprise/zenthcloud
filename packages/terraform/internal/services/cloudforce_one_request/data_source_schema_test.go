// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package cloudforce_one_request_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/cloudforce_one_request"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCloudforceOneRequestDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*cloudforce_one_request.CloudforceOneRequestDataSourceModel)(nil)
	schema := cloudforce_one_request.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
