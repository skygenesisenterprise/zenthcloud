// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package r2_bucket_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/r2_bucket"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestR2BucketModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*r2_bucket.R2BucketModel)(nil)
	schema := r2_bucket.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
