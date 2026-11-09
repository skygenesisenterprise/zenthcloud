package dns_zone_transfers_tsig_test

import (
	"context"
	"errors"
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
	resource.AddTestSweepers("zenthcloud_dns_zone_transfers_tsig", &resource.Sweeper{
		Name: "zenthcloud_dns_zone_transfers_tsig",
		F:    testSweepZenthcloudSecondaryDNSTSIG,
	})
}

func testSweepZenthcloudSecondaryDNSTSIG(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	// Clean up the account level tsigs
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		return errors.New("ZENTHCLOUD_ACCOUNT_ID must be set")
	}

	tsigs, err := client.DNS.ZoneTransfers.TSIGs.List(context.Background(), dns.ZoneTransferTSIGListParams{AccountID: zenthcloud.F(accountID)})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud tsigs: %s", err))
	}

	if len(tsigs.Result) == 0 {
		tflog.Info(ctx, "No Zenthcloud tsigs records to sweep")
		return nil
	}

	for _, tsig := range tsigs.Result {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(tsig.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zenthcloud TSIG: %s (%s)", tsig.Name, tsig.ID))
		_, err := client.DNS.ZoneTransfers.TSIGs.Delete(context.TODO(), tsig.ID, dns.ZoneTransferTSIGDeleteParams{AccountID: zenthcloud.F(accountID)})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete DNS zone transfer TSIG %s (%s): %s", tsig.Name, tsig.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted DNS zone transfer TSIG: %s (%s)", tsig.Name, tsig.ID))
	}

	return nil
}

func TestAccZenthcloudSecondaryDNSTSIG_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_dns_zone_transfers_tsig." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testSecondaryDNSTSIGConfig(rnd, accountID, rnd, "hmac-sha512.", "caf79a7804b04337c9c66ccd7bef9190a1e1679b5dd03d8aa10f7ad45e1a9dab92b417896c15d4d007c7c14194538d2a5d0feffdecc5a7f0e1c570cfa700837c"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd+"."),
					resource.TestCheckResourceAttr(name, "algo", "hmac-sha512."),
					resource.TestCheckResourceAttr(name, "secret", "caf79a7804b04337c9c66ccd7bef9190a1e1679b5dd03d8aa10f7ad45e1a9dab92b417896c15d4d007c7c14194538d2a5d0feffdecc5a7f0e1c570cfa700837c"),
				),
			},
		},
	})
}

func TestAccZenthcloudSecondaryDNSTSIG_Update(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_dns_zone_transfers_tsig." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testSecondaryDNSTSIGConfig(rnd, accountID, rnd, "hmac-sha512.", "baf79a7804b04337c9c66ccd7bef9190a1e1679b5dd03d8aa10f7ad45e1a9dab92b417896c15d4d007c7c14194538d2a5d0feffdecc5a7f0e1c570cfa700837c"),
			},
			{
				Config: testSecondaryDNSTSIGConfig(rnd, accountID, rnd, "hmac-sha512.", "caf79a7804b04337c9c66ccd7bef9190a1e1679b5dd03d8aa10f7ad45e1a9dab92b417896c15d4d007c7c14194538d2a5d0feffdecc5a7f0e1c570cfa700837c"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd+"."),
					resource.TestCheckResourceAttr(name, "algo", "hmac-sha512."),
					resource.TestCheckResourceAttr(name, "secret", "caf79a7804b04337c9c66ccd7bef9190a1e1679b5dd03d8aa10f7ad45e1a9dab92b417896c15d4d007c7c14194538d2a5d0feffdecc5a7f0e1c570cfa700837c"),
				),
			},
		},
	})
}

func testSecondaryDNSTSIGConfig(resourceID, accountID, name, algo, secret string) string {
	return acctest.LoadTestCase("tsig.tf", resourceID, accountID, name+".", algo, secret)
}
