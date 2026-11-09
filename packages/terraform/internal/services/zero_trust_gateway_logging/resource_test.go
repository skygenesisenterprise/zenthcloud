package zero_trust_gateway_logging_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccUpgradeZeroTrustGatewayLogging_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_gateway_logging.%s", rnd)

	config := fmt.Sprintf(`
resource "zenthcloud_zero_trust_gateway_logging" "%[1]s" {
  account_id = "%[2]s"
}
`, rnd, accountID)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.16.0",
					},
				},
				Config:             config,
				ExpectNonEmptyPlan: true,
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
				ExpectNonEmptyPlan:       true,
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "account_id", accountID),
				),
			},
		},
	})
}
