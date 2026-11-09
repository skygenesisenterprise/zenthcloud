// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_device_deployment_groups_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_device_deployment_groups"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustDeviceDeploymentGroupsModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_device_deployment_groups.ZeroTrustDeviceDeploymentGroupsModel)(nil)
	schema := zero_trust_device_deployment_groups.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
