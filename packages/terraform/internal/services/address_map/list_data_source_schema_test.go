// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package address_map_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/address_map"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestAddressMapsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*address_map.AddressMapsDataSourceModel)(nil)
	schema := address_map.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
