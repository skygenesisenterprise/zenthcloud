// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package secrets_store_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/secrets_store"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSecretsStoresDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*secrets_store.SecretsStoresDataSourceModel)(nil)
	schema := secrets_store.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
