package oauth_client_test

import (
	"fmt"
	"os"
	"strconv"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestAccZenthcloudOAuthClient_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_oauth_client.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudOAuthClientConfig(rnd, accountID, rnd, "https://example.com/callback"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "client_name", rnd),
					resource.TestCheckResourceAttr(name, "token_endpoint_auth_method", "none"),
					resource.TestCheckResourceAttr(name, "grant_types.0", "authorization_code"),
					resource.TestCheckResourceAttr(name, "redirect_uris.0", "https://example.com/callback"),
					resource.TestCheckResourceAttr(name, "response_types.0", "code"),
					testAccCheckListAttrContains(name, "scopes", "user-details.read"),
					testAccCheckListAttrContains(name, "scopes", "teams.read"),
					resource.TestCheckResourceAttrSet(name, "client_id"),
				),
			},
			{
				Config: testAccZenthcloudOAuthClientConfig(rnd, accountID, rnd+"-updated", "https://example.com/updated-callback"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "client_name", rnd+"-updated"),
					resource.TestCheckResourceAttr(name, "redirect_uris.0", "https://example.com/updated-callback"),
					resource.TestCheckResourceAttrSet(name, "client_id"),
				),
			},
		},
	})
}

func TestAccZenthcloudOAuthClient_Datasource(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_oauth_client.%s", rnd)
	dataSourceName := fmt.Sprintf("data.zenthcloud_oauth_client.%s", rnd)
	listDataSourceName := fmt.Sprintf("data.zenthcloud_oauth_clients.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudOAuthClientDataSourceConfig(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttrPair(dataSourceName, "client_id", resourceName, "client_id"),
					resource.TestCheckResourceAttr(dataSourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(dataSourceName, "client_name", rnd),
					testAccCheckListAttrContains(dataSourceName, "scopes", "user-details.read"),
					testAccCheckListAttrContains(dataSourceName, "scopes", "teams.read"),
					testAccCheckOAuthClientsListContains(listDataSourceName, rnd),
				),
			},
		},
	})
}

func testAccCheckOAuthClientsListContains(resourceName, clientName string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("not found: %s", resourceName)
		}

		count, err := strconv.Atoi(rs.Primary.Attributes["result.#"])
		if err != nil {
			return err
		}
		for i := 0; i < count; i++ {
			if rs.Primary.Attributes[fmt.Sprintf("result.%d.client_name", i)] == clientName {
				return nil
			}
		}

		return fmt.Errorf("OAuth client %q not found in %s", clientName, resourceName)
	}
}

func testAccCheckListAttrContains(resourceName, attrName, want string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("not found: %s", resourceName)
		}

		count, err := strconv.Atoi(rs.Primary.Attributes[attrName+".#"])
		if err != nil {
			return err
		}
		for i := 0; i < count; i++ {
			if rs.Primary.Attributes[fmt.Sprintf("%s.%d", attrName, i)] == want {
				return nil
			}
		}

		return fmt.Errorf("%s does not contain %q in %s", attrName, want, resourceName)
	}
}

func testAccZenthcloudOAuthClientConfig(resourceID, accountID, clientName, redirectURI string) string {
	return acctest.LoadTestCase("basic.tf", resourceID, accountID, clientName, redirectURI)
}

func testAccZenthcloudOAuthClientDataSourceConfig(resourceID, accountID string) string {
	return acctest.LoadTestCase("data_source.tf", resourceID, accountID)
}
