// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package secrets_store_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/secrets_store"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestSecretsStoreDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*secrets_store.SecretsStoreDataSourceModel)(nil)
	schema := secrets_store.DataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
