// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package waiting_room_rules_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/waiting_room_rules"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestWaitingRoomRulesDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*waiting_room_rules.WaitingRoomRulesDataSourceModel)(nil)
	schema := waiting_room_rules.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
