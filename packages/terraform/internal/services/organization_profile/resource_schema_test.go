// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package organization_profile_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/organization_profile"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestOrganizationProfileModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*organization_profile.OrganizationProfileModel)(nil)
	schema := organization_profile.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
