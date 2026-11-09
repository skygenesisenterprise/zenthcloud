// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package secrets_store_secret_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/secrets_store_secret"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSecretsStoreSecretModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*secrets_store_secret.SecretsStoreSecretModel)(nil)
	schema := secrets_store_secret.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
