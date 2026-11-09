// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_device_deployment_groups_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_device_deployment_groups"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDeviceDeploymentGroupsListDataSourceModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_device_deployment_groups.ZeroTrustDeviceDeploymentGroupsListDataSourceModel)(nil)
	schema := zero_trust_device_deployment_groups.ListDataSourceSchema(context.TODO())
	errs := test_helpers.ValidateDataSourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
