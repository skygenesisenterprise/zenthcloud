// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_dlp_custom_entry_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_dlp_custom_entry"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDLPCustomEntryModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_dlp_custom_entry.ZeroTrustDLPCustomEntryModel)(nil)
	schema := zero_trust_dlp_custom_entry.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
