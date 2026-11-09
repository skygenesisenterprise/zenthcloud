// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package organization_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/organization"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestOrganizationModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*organization.OrganizationModel)(nil)
	schema := organization.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
