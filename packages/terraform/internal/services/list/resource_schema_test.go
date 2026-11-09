// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package list_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/list"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestListModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*list.ListModel)(nil)
	schema := list.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
