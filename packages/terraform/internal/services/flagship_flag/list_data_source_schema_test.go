// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package flagship_flag_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/flagship_flag"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestFlagshipFlagsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*flagship_flag.FlagshipFlagsDataSourceModel)(nil)
	schema := flagship_flag.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
