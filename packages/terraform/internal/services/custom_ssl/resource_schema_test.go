// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package custom_ssl_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/custom_ssl"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestCustomSSLModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*custom_ssl.CustomSSLModel)(nil)
	schema := custom_ssl.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
