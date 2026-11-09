// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_resource_library_application_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_resource_library_application"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustResourceLibraryApplicationsDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_resource_library_application.ZeroTrustResourceLibraryApplicationsDataSourceModel)(nil)
	schema := zero_trust_resource_library_application.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
