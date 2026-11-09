package image_variant_test

import (
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudImageVariantDataSource_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	datasourceName := "data.zenthcloud_image_variant." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccImageVariantDataSourceConfig(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(datasourceName, "variant_id", rnd),
					resource.TestCheckResourceAttr(datasourceName, "variant.options.fit", "scale-down"),
					resource.TestCheckResourceAttr(datasourceName, "variant.options.height", "480"),
					resource.TestCheckResourceAttr(datasourceName, "variant.options.width", "640"),
					resource.TestCheckResourceAttr(datasourceName, "variant.options.metadata", "keep"),
				),
			},
		},
	})
}

func testAccImageVariantDataSourceConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("datasource_basic.tf", rnd, accountID)
}
