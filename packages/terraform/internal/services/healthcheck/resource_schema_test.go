// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package healthcheck_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/healthcheck"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestHealthcheckModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*healthcheck.HealthcheckModel)(nil)
	schema := healthcheck.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
