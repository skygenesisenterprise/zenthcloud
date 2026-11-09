package dns_zone_transfers_outgoing_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/dns"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_dns_zone_transfers_outgoing", &resource.Sweeper{
		Name: "zenthcloud_dns_zone_transfers_outgoing",
		F:    testSweepZenthcloudSecondaryDNSOutgoing,
	})
}

func testSweepZenthcloudSecondaryDNSOutgoing(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	// Clean up the connections between peers and zones
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping DNS zone transfers outgoing sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	outgoingZone, err := client.DNS.ZoneTransfers.Outgoing.Get(ctx, dns.ZoneTransferOutgoingGetParams{ZoneID: zenthcloud.F(zoneID)})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud outgoing secondary zones: %s", err))
		return fmt.Errorf("failed to fetch Zenthcloud outgoing secondary zones: %w", err)
	}

	if len(outgoingZone.Peers) == 0 {
		tflog.Info(ctx, "No Zenthcloud peers connected to zones records to sweep")
		return nil
	}

	tflog.Info(ctx, fmt.Sprintf("Clearing %d peers from outgoing zone transfers (zone: %s)", len(outgoingZone.Peers), zoneID))
	_, err = client.DNS.ZoneTransfers.Outgoing.Update(ctx, dns.ZoneTransferOutgoingUpdateParams{ZoneID: zenthcloud.F(zoneID), Peers: zenthcloud.F([]string{})})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to clear peers on outgoing zone: %s", err))
		return fmt.Errorf("failed to clear peers on outgoing zone: %w", err)
	}

	tflog.Info(ctx, "Cleared peers from outgoing zone transfers")
	return nil
}

func TestAccZenthcloudSecondaryDNSOutgoing_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	name := "zenthcloud_dns_zone_transfers_outgoing." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testSecondaryDNSOutgoingConfig(rnd, zoneName, zoneID, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", zoneName),
				),
			},
		},
	})
}

func TestAccZenthcloudSecondaryDNSOutgoing_Update(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	name := "zenthcloud_dns_zone_transfers_outgoing." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testSecondaryDNSOutgoingConfig(rnd, zoneName, zoneID, accountID),
			},
			{
				Config: testSecondaryDNSOutgoingConfig(rnd, zoneName, zoneID, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", zoneName),
				),
			},
		},
	})
}

func testSecondaryDNSOutgoingConfig(resourceID, zoneName, zoneID string, accountID string) string {
	return acctest.LoadTestCase("outgoing.tf", resourceID, zoneID, zoneName, accountID)
}
