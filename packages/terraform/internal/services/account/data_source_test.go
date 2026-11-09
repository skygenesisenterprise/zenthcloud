package account_test

import (
	"fmt"
	"strconv"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestAccZenthcloudAccounts(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_accounts.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccountsConfig(rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccZenthcloudAccountsSize(name),
				),
			},
		},
	})
}

func testAccZenthcloudAccountsConfig(name string) string {
	return fmt.Sprintf(`data "zenthcloud_accounts" "%[1]s" { }`, name)
}

func testAccZenthcloudAccountsSize(n string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		r := s.RootModule().Resources[n]
		a := r.Primary.Attributes

		var (
			accountsSize int
			err          error
		)

		if accountsSize, err = strconv.Atoi(a["result.#"]); err != nil {
			return err
		}

		if accountsSize < 1 {
			return fmt.Errorf("accounts count seems suspicious: %d", accountsSize)
		}

		return nil
	}
}
