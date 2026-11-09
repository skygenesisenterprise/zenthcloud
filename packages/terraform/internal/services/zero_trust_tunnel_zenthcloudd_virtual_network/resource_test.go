package zero_trust_tunnel_zenthcloudd_virtual_network_test

import (
	"context"
	"errors"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network",
		F:    testSweepZenthcloudTunnelVirtualNetwork,
	})
}

func testSweepZenthcloudTunnelVirtualNetwork(r string) error {
	ctx := context.Background()

	client := acctest.SharedClient()

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		return errors.New("ZENTHCLOUD_ACCOUNT_ID must be set")
	}

	tunnelVirtualNetworks, err := client.ZeroTrust.Networks.VirtualNetworks.List(
		ctx, zero_trust.NetworkVirtualNetworkListParams{
			AccountID: zenthcloud.F(accountID),
		})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch tunnel virtual networks: %s", err))
		return err
	}

	if len(tunnelVirtualNetworks.Result) == 0 {
		tflog.Info(ctx, "No tunnel virtual networks to sweep")
		return nil
	}

	for _, vnet := range tunnelVirtualNetworks.Result {
		if !utils.ShouldSweepResource(vnet.Name) {
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleting tunnel virtual network: %s (%s) (account: %s)", vnet.Name, vnet.ID, accountID))

		_, err = client.ZeroTrust.Networks.VirtualNetworks.Delete(
			ctx,
			vnet.ID,
			zero_trust.NetworkVirtualNetworkDeleteParams{
				AccountID: zenthcloud.F(accountID),
			},
		)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete tunnel virtual network %s: %s", vnet.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted tunnel virtual network: %s", vnet.ID))
	}
	return nil
}

func testAccCheckZenthcloudTunnelVirtualNetworkDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" {
			continue
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		_, err := client.ZeroTrust.Networks.VirtualNetworks.Get(context.Background(), rs.Primary.ID, zero_trust.NetworkVirtualNetworkGetParams{
			AccountID: zenthcloud.F(accountID),
		})
		if err == nil {
			return fmt.Errorf("tunnel virtual network still exists")
		}
	}

	return nil
}

func TestAccZenthcloudTunnelVirtualNetwork_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTunnelVirtualNetworkDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTunnelVirtualNetworkSimple(rnd, rnd, accountID, rnd, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("comment"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
				},
			},
			// Update
			{
				Config: testAccZenthcloudTunnelVirtualNetworkSimple(rnd, rnd+"-updated", accountID, rnd, false),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(
							name,
							tfjsonpath.New("comment"),
							knownvalue.StringExact(rnd+"-updated"),
						),
						plancheck.ExpectKnownValue(
							name,
							tfjsonpath.New("name"),
							knownvalue.StringExact(rnd),
						),
						plancheck.ExpectKnownValue(
							name,
							tfjsonpath.New("is_default_network"),
							knownvalue.Bool(false),
						),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("comment"), knownvalue.StringExact(rnd+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
				},
			},
			// Re-applying same change does not produce drift
			{
				Config: testAccZenthcloudTunnelVirtualNetworkSimple(rnd, rnd+"-updated", accountID, rnd, false),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Import
			{
				ResourceName:        name,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
			},
		},
	})
}

func TestAccZenthcloudTunnelVirtualNetwork_Minimal(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTunnelVirtualNetworkDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTunnelVirtualNetworkMinimal(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("comment"), knownvalue.StringExact("")),        // Default value
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default_network"), knownvalue.Bool(false)), // Default value
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("created_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("deleted_at"), knownvalue.Null()),
				},
			},
			{
				ResourceName:        name,
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

func testAccZenthcloudTunnelVirtualNetworkSimple(ID, comment, accountID, name string, isDefault bool) string {
	return acctest.LoadTestCase("tunnelvirtualnetworksimple.tf", ID, comment, accountID, name, isDefault)
}

func testAccZenthcloudTunnelVirtualNetworkMinimal(name, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" "%s" {
	account_id = "%s"
	name       = "%s"
}`, name, accountID, name)
}

func TestAccUpgradeZeroTrustTunnelZenthclouddVirtualNetwork_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccZenthcloudTunnelVirtualNetworkSimple(rnd, rnd, accountID, rnd, false)

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
				Config: config,
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}
