// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package queue_consumer_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/queue_consumer"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestQueueConsumerDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*queue_consumer.QueueConsumerDataSourceModel)(nil)
	schema := queue_consumer.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Ignore(t, ".@QueueConsumerDataSourceModel.created_on")
	errs.Report(t)
}
