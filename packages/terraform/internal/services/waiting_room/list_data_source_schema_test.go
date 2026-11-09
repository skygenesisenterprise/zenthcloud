// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package waiting_room_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/waiting_room"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestWaitingRoomsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*waiting_room.WaitingRoomsDataSourceModel)(nil)
	schema := waiting_room.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
