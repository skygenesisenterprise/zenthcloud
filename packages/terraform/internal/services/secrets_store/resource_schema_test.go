// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package secrets_store_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/secrets_store"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSecretsStoreModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*secrets_store.SecretsStoreModel)(nil)
	schema := secrets_store.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
