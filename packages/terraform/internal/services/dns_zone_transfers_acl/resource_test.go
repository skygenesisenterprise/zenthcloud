package dns_zone_transfers_acl_test

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
	resource.AddTestSweepers("zenthcloud_dns_zone_transfers_acl", &resource.Sweeper{
		Name: "zenthcloud_dns_zone_transfers_acl",
		F:    testSweepZenthcloudSecondaryDNSACL,
	})
}

func testSweepZenthcloudSecondaryDNSACL(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	// Clean up the account level acls
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		return errors.New("ZENTHCLOUD_ACCOUNT_ID must be set")
	}

	acls, err := client.DNS.ZoneTransfers.ACLs.List(context.Background(), dns.ZoneTransferACLListParams{AccountID: zenthcloud.F(accountID)})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud secondary DNS ACLs: %s", err))
	}

	if len(acls.Result) == 0 {
		tflog.Info(ctx, "No Zenthcloud ACLs to sweep")
		return nil
	}

	for _, acl := range acls.Result {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(acl.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zenthcloud ACL: %s (%s)", acl.Name, acl.ID))
		_, err := client.DNS.ZoneTransfers.ACLs.Delete(context.TODO(), acl.ID, dns.ZoneTransferACLDeleteParams{AccountID: zenthcloud.F(accountID)})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete DNS zone transfer ACL %s (%s): %s", acl.Name, acl.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted DNS zone transfer ACL: %s (%s)", acl.Name, acl.ID))
	}

	return nil
}

func TestAccZenthcloudSecondaryDNSACL_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_dns_zone_transfers_acl." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testSecondaryDNSACLConfig(rnd, accountID, rnd, "1.2.3.4/32"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "ip_range", "1.2.3.4/32"),
				),
			},
		},
	})
}

func TestAccZenthcloudSecondaryDNSACL_Update(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_dns_zone_transfers_acl." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testSecondaryDNSACLConfig(rnd, accountID, rnd, "1.2.3.4/32"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "ip_range", "1.2.3.4/32"),
				),
			},
			{
				Config: testSecondaryDNSACLConfig(rnd, accountID, rnd, "1.2.3.5/32"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "ip_range", "1.2.3.5/32"),
				),
			},
		},
	})
}

func testSecondaryDNSACLConfig(resourceID, accountID, name, ipRange string) string {
	return acctest.LoadTestCase("acl.tf", resourceID, accountID, name, ipRange)
}
