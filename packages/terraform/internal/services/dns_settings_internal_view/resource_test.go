package dns_settings_internal_view_test

import (
	"context"
	"errors"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/dns"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_dns_settings_internal_view", &resource.Sweeper{
		Name: "zenthcloud_dns_settings_internal_view",
		F:    testSweepZenthcloudDNSSettingsInternalView,
	})
}

func testSweepZenthcloudDNSSettingsInternalView(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	// Clean up the account level views
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		return errors.New("ZENTHCLOUD_ACCOUNT_ID must be set")
	}

	views, err := client.DNS.Settings.Account.Views.List(context.Background(), dns.SettingAccountViewListParams{AccountID: zenthcloud.F(accountID)})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud DNS internal views: %s", err))
	}

	if len(views.Result) == 0 {
		tflog.Info(ctx, "No Zenthcloud views to sweep")
		return nil
	}

	for _, view := range views.Result {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(view.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zenthcloud View: %s (%s)", view.Name, view.ID))
		_, err := client.DNS.Settings.Account.Views.Delete(context.TODO(), view.ID, dns.SettingAccountViewDeleteParams{AccountID: zenthcloud.F(accountID)})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete DNS internal view %s (%s): %s", view.Name, view.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted DNS internal view: %s (%s)", view.Name, view.ID))
	}

	return nil
}

func TestAccZenthcloudDNSInternalView_Basic(t *testing.T) {
	acctest.TestAccPreCheck_InternalZoneID(t)

	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_dns_settings_internal_view." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	internalZoneID := os.Getenv("ZENTHCLOUD_INTERNAL_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testDNSInternalViewConfig(rnd, accountID, rnd, internalZoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "zones.0", internalZoneID),
				),
			},
		},
	})
}

func TestAccZenthcloudDNSInternalView_Update(t *testing.T) {
	acctest.TestAccPreCheck_InternalZoneID(t)

	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_dns_settings_internal_view." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	internalZoneID := os.Getenv("ZENTHCLOUD_INTERNAL_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testDNSInternalViewConfig(rnd, accountID, rnd, internalZoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "zones.0", internalZoneID),
				),
			},
			{
				Config: testDNSInternalViewConfig(rnd, accountID, rnd+"-update", internalZoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd+"-update"),
					resource.TestCheckResourceAttr(name, "zones.0", internalZoneID),
				),
			},
		},
	})
}

func testDNSInternalViewConfig(resourceID, accountID, name, zone string) string {
	return acctest.LoadTestCase("view.tf", resourceID, accountID, name, zone)
}
