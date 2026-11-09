// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package queue_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/queue"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestQueueDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*queue.QueueDataSourceModel)(nil)
	schema := queue.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
