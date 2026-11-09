package zero_trust_tunnel_zenthcloudd_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	zenthcloud6 "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/option"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_tunnel_zenthcloudd", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_tunnel_zenthcloudd",
		F:    testSweepZenthcloudZeroTrustTunnelZenthcloudd,
	})
}

func testSweepZenthcloudZeroTrustTunnelZenthcloudd(region string) error {
	ctx := context.Background()
	client := acctest.SharedClient()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	if accountID == "" {
		tflog.Info(ctx, "Skipping zenthcloudd tunnels sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	page, err := client.ZeroTrust.Tunnels.Zenthcloudd.List(
		ctx,
		zero_trust.TunnelZenthclouddListParams{
			AccountID: zenthcloud6.F(accountID),
		},
	)
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to list zenthcloudd tunnels: %s", err))
		return fmt.Errorf("error listing zenthcloudd tunnels for sweep: %w", err)
	}

	tunnelCount := 0
	for page != nil && len(page.Result) > 0 {
		for _, tunnel := range page.Result {
			if tunnel.ID == "" {
				tflog.Debug(ctx, fmt.Sprintf("Skipping zenthcloudd tunnel with empty ID: %s", tunnel.Name))
				continue
			}

			if !tunnel.DeletedAt.IsZero() {
				tflog.Debug(ctx, fmt.Sprintf("Skipping already deleted zenthcloudd tunnel: %s (%s)", tunnel.Name, tunnel.ID))
				continue
			}

			if !utils.ShouldSweepResource(tunnel.Name) {
				continue
			}

			tunnelCount++
			tflog.Info(ctx, fmt.Sprintf("Deleting zenthcloudd tunnel: %s (%s) (account: %s)", tunnel.Name, tunnel.ID, accountID))

			_, err := client.ZeroTrust.Tunnels.Zenthcloudd.Delete(
				ctx,
				tunnel.ID,
				zero_trust.TunnelZenthclouddDeleteParams{
					AccountID: zenthcloud6.F(accountID),
				},
				option.WithQuery("cascade", "true"),
			)
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete zenthcloudd tunnel %s: %s", tunnel.ID, err))
				continue
			}

			tflog.Info(ctx, fmt.Sprintf("Deleted zenthcloudd tunnel: %s with cascade", tunnel.ID))
		}

		page, err = page.GetNextPage()
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to get next page of tunnels: %s", err))
			break
		}
	}

	if tunnelCount == 0 {
		tflog.Info(ctx, "No zenthcloudd tunnels to sweep")
	}

	return nil
}

func TestAccZenthcloudTunnelCreate_Basic(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Argo Tunnel
	// endpoint does not yet support the API tokens.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_tunnel_zenthcloudd.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTunnelDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTunnelBasic(accID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "tunnel_secret", "AQIDBAUGBwgBAgMEBQYHCAECAwQFBgcIAQIDBAUGBwg="),
				),
			},
		},
	})
}

func testAccCheckZenthcloudTunnelBasic(accID, name string) string {
	return acctest.LoadTestCase("tunnelbasic.tf", accID, name)
}

func TestAccZenthcloudTunnelCreate_Managed(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Argo Tunnel
	// endpoint does not yet support the API tokens.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_tunnel_zenthcloudd.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTunnelDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTunnelManaged(accID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "tunnel_secret", "AQIDBAUGBwgBAgMEBQYHCAECAwQFBgcIAQIDBAUGBwg="),
					resource.TestCheckResourceAttr(name, "config_src", "zenthcloud"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudTunnelManaged(accID, name string) string {
	return acctest.LoadTestCase("tunnelmanaged.tf", accID, name)
}

func TestAccZenthcloudTunnelCreate_Unmanaged(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Argo Tunnel
	// endpoint does not yet support the API tokens.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_tunnel_zenthcloudd.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTunnelDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTunnelUnmanaged(accID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "tunnel_secret", "AQIDBAUGBwgBAgMEBQYHCAECAwQFBgcIAQIDBAUGBwg="),
					resource.TestCheckResourceAttr(name, "config_src", "local"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudTunnelUnmanaged(accID, name string) string {
	return acctest.LoadTestCase("tunnelunmanaged.tf", accID, name)
}

func testAccCheckZenthcloudTunnelDestroy(s *terraform.State) error {
	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_tunnel_zenthcloudd" {
			continue
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		tunnelID := rs.Primary.ID
		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		tunnel, err := client.GetTunnel(context.Background(), zenthcloud.AccountIdentifier(accountID), tunnelID)

		if err != nil {
			return err
		}

		if tunnel.DeletedAt == nil {
			return fmt.Errorf("argo tunnel with ID %s still exists", tunnel.ID)
		}
	}

	return nil
}

func TestAccZenthcloudTunnelRotateSecret(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Argo Tunnel
	// endpoint does not yet support the API tokens.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_tunnel_zenthcloudd.%s", rnd)

	secretV1 := "dGhpc19pc18xX3NlY3JldF9mb3JfdGhlX2ZpcnN0"
	secretV2 := "Ml9zZWNyZXRfMl90dW5uZWxfdXBkYXRl"

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTunnelDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTunnelRotateSecret(accID, rnd, secretV1),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "tunnel_secret", secretV1),
				),
			},
			{
				Config: testAccCheckZenthcloudTunnelRotateSecret(accID, rnd, secretV2),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "tunnel_secret", secretV2),
				),
			},
		},
	})
}

func testAccCheckZenthcloudTunnelRotateSecret(accID, name, secret string) string {
	return acctest.LoadTestCase("tunnelsecret.tf", accID, name, secret)
}

func TestAccUpgradeZeroTrustTunnelZenthcloudd_FromPublishedV5(t *testing.T) {
	accID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccCheckZenthcloudTunnelBasic(accID, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
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
