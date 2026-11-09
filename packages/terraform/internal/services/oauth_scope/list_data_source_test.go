package oauth_scope_test

import (
	"fmt"
	"strconv"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestAccZenthcloudOAuthScopes_Datasource(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_oauth_scopes.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudOAuthScopesDataSourceConfig(rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttrSet(name, "result.0.id"),
					resource.TestCheckResourceAttrSet(name, "result.0.name"),
					testAccCheckOAuthScopesContains(name, "user-details.read"),
					testAccCheckOAuthScopesContains(name, "teams.read"),
				),
			},
		},
	})
}

func testAccCheckOAuthScopesContains(resourceName, scopeID string) resource.TestCheckFunc {
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
			if rs.Primary.Attributes[fmt.Sprintf("result.%d.id", i)] == scopeID {
				return nil
			}
		}

		return fmt.Errorf("OAuth scope %q not found in %s", scopeID, resourceName)
	}
}

func testAccZenthcloudOAuthScopesDataSourceConfig(resourceID string) string {
	return acctest.LoadTestCase("data_source.tf", resourceID)
}
