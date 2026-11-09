package zero_trust_tunnel_zenthcloudd_virtual_network_test

import (
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudTunnelVirtualNetworkDatasource_MatchName(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network." + rnd
	dataSourceName := "data.zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network." + rnd

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudTunnelVirtualNetworkMatchName(rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					// Check resource attributes
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("comment"), knownvalue.StringExact("test")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("is_default_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("created_at"), knownvalue.NotNull()),

					// Check data source attributes match resource attributes
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("comment"), knownvalue.StringExact("test")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("is_default_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("created_at"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func testZenthcloudTunnelVirtualNetworkMatchName(name string) string {
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	return acctest.LoadTestCase("zenthcloudtunnelvirtualnetworkmatchname.tf", accountID, name)
}
