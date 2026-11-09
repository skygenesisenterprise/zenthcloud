// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package snippet_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/snippet"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSnippetModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*snippet.SnippetModel)(nil)
	schema := snippet.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
