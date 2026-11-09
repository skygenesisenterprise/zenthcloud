package dns_zone_transfers_incoming_test

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
	resource.AddTestSweepers("zenthcloud_dns_zone_transfers_incoming", &resource.Sweeper{
		Name: "zenthcloud_dns_zone_transfers_incoming",
		F:    testSweepZenthcloudDNSZoneTransfersIncoming,
	})
}

func testSweepZenthcloudDNSZoneTransfersIncoming(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	// Clean up the connections between peers and zones
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		return errors.New("ZENTHCLOUD_ZONE_ID must be set")
	}

	incomingZone, err := client.DNS.ZoneTransfers.Incoming.Get(context.Background(), dns.ZoneTransferIncomingGetParams{ZoneID: zenthcloud.F(zoneID)})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud incoming secondary zones: %s", err))
	}

	if len(incomingZone.Peers) == 0 {
		tflog.Info(ctx, "No Zenthcloud peers connected to zones records to sweep")
		return nil
	}

	_, err = client.DNS.ZoneTransfers.Incoming.Update(context.Background(), dns.ZoneTransferIncomingUpdateParams{ZoneID: zenthcloud.F(zoneID), Peers: zenthcloud.F([]string{})})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to clear peers on incoming zone: %s", err))
	}

	return nil
}

func TestAccZenthcloudDNSZoneTransfersIncoming_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	name := "zenthcloud_dns_zone_transfers_incoming." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testDNSZoneTransfersIncomingConfig(rnd, zoneName, zoneID, 300, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", zoneName),
					resource.TestCheckResourceAttr(name, "auto_refresh_seconds", "300"),
				),
			},
		},
	})
}

func TestAccZenthcloudDNSZoneTransfersIncoming_Update(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	name := "zenthcloud_dns_zone_transfers_incoming." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testDNSZoneTransfersIncomingConfig(rnd, zoneName, zoneID, 300, accountID),
			},
			{
				Config: testDNSZoneTransfersIncomingConfig(rnd, zoneName, zoneID, 500, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", zoneName),
					resource.TestCheckResourceAttr(name, "auto_refresh_seconds", "500"),
				),
			},
		},
	})
}

func testDNSZoneTransfersIncomingConfig(resourceID, zoneName, zoneID string, autoRefreshSeconds int, accountID string) string {
	return acctest.LoadTestCase("incoming.tf", resourceID, zoneID, autoRefreshSeconds, zoneName, accountID)
}
