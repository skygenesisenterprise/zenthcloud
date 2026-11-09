// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package content_scanning_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/content_scanning"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestContentScanningModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*content_scanning.ContentScanningModel)(nil)
	schema := content_scanning.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
