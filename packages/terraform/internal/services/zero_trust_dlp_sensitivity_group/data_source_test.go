package zero_trust_dlp_sensitivity_group_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/hashicorp/terraform-plugin-testing/compare"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

// TestAccZenthcloudZeroTrustDLPSensitivityGroupDataSource_Basic verifies that
// the data source reads the same attributes as the underlying resource.
func TestAccZenthcloudZeroTrustDLPSensitivityGroupDataSource_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_dlp_sensitivity_group.%s", rnd)
	dataSourceName := fmt.Sprintf("data.zenthcloud_zero_trust_dlp_sensitivity_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: acctest.LoadTestCase("datasource_basic.tf", rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.CompareValuePairs(
						resourceName, tfjsonpath.New("id"),
						dataSourceName, tfjsonpath.New("id"),
						compare.ValuesSame()),
					statecheck.CompareValuePairs(
						resourceName, tfjsonpath.New("name"),
						dataSourceName, tfjsonpath.New("name"),
						compare.ValuesSame()),
					statecheck.CompareValuePairs(
						resourceName, tfjsonpath.New("description"),
						dataSourceName, tfjsonpath.New("description"),
						compare.ValuesSame()),
				},
			},
		},
	})
}
