package zero_trust_access_application_test

import (
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"

	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudAccessApplicationDataSource_AccountName(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "data.zenthcloud_zero_trust_access_application." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessApplicationAccountName(accountID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", rnd+"."+domain),
					resource.TestCheckResourceAttrSet(name, "aud"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudAccessApplicationAccountName(accountID, name, domain string) string {
	return acctest.LoadTestCase("data_accessapplicationaccountname.tf", name, accountID, domain)
}

func TestAccZenthcloudAccessApplicationDataSource_AccountDomain(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "data.zenthcloud_zero_trust_access_application." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessApplicationAccountDomain(accountID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", rnd+"."+domain),
					resource.TestCheckResourceAttrSet(name, "aud"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudAccessApplicationAccountDomain(accountID, name, domain string) string {
	return acctest.LoadTestCase("data_accessapplicationaccountdomain.tf", name, accountID, domain)
}

func TestAccZenthcloudAccessApplicationDataSource_ZoneName(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "data.zenthcloud_zero_trust_access_application." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessApplicationZoneName(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", rnd+"."+domain),
					resource.TestCheckResourceAttrSet(name, "aud"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudAccessApplicationZoneName(zoneID, name, domain string) string {
	return acctest.LoadTestCase("data_accessapplicationzonename.tf", name, zoneID, domain)
}

func TestAccZenthcloudAccessApplicationDataSource_ZoneDomain(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "data.zenthcloud_zero_trust_access_application." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessApplicationZoneDomain(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", rnd+"."+domain),
					resource.TestCheckResourceAttrSet(name, "aud"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudAccessApplicationZoneDomain(zoneID, name, domain string) string {
	return acctest.LoadTestCase("data_accessapplicationzonedomain.tf", name, zoneID, domain)
}
