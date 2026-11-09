// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package flagship_flag_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/flagship_flag"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestFlagshipFlagModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*flagship_flag.FlagshipFlagModel)(nil)
	schema := flagship_flag.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
