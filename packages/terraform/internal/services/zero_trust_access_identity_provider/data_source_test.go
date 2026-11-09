package zero_trust_access_identity_provider_test

import (
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudAccessIdentityProviderDataSource_PreventZoneIdAndAccountIdConflicts(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testZenthcloudAccessIdentityProviderDataSourceConfigConflictingFields(rnd),
				ExpectError: regexp.MustCompile(regexp.QuoteMeta("Exactly one of these attributes must be configured")),
			},
		},
	})
}

func testZenthcloudAccessIdentityProviderDataSourceConfigConflictingFields(rnd string) string {
	return fmt.Sprintf(`
data "zenthcloud_zero_trust_access_identity_provider" "%[1]s" {
  account_id = "123abc"
  zone_id    = "abc123"
}
`, rnd)
}

func TestAccZenthcloudAccessIdentityProviderDataSource_PreventNoInputSpecify(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testZenthcloudAccessIdentityProviderDataSourceNoInput(rnd),
				ExpectError: regexp.MustCompile(regexp.QuoteMeta("Exactly one of these attributes must be configured")),
			},
		},
	})
}

func testZenthcloudAccessIdentityProviderDataSourceNoInput(rnd string) string {
	return fmt.Sprintf(`
data "zenthcloud_zero_trust_access_identity_provider" "%[1]s" {
}
`, rnd)
}

func TestAccZenthcloudAccessIdentityProviderDataSourceNotFound(t *testing.T) {
	t.Skip(`FIXME: "message": "access.api.error.not_found"`)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudAccessIdentityProviderDataSource_NotFound(accountID, rnd),
				ExpectError: regexp.MustCompile(`no Access Identity Providers found|no Access Identity Provider matching name`),
			},
		},
	})
}

func testAccCheckZenthcloudAccessIdentityProviderDataSource_NotFound(accountID, name string) string {
	return acctest.LoadTestCase("notfound.tf", name, accountID)
}

func TestAccZenthcloudAccessIdentityProviderDataSource_GitHub(t *testing.T) {
	t.Skip(`FIXME: Exactly one of these attributes must be configured: [identity_provider_id,filter]`)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()

	name := "data.zenthcloud_zero_trust_access_identity_provider." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderDataSourceGitHub(accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "type", "github"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudAccessIdentityProviderDataSourceGitHub(accountID, name string) string {
	return acctest.LoadTestCase("accessidentityproviderdatasourcegithub.tf", name, accountID)
}
