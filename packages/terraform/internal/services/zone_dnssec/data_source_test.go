package zone_dnssec_test

import (
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudZoneDNSSEC(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneDNSSECConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|disabled|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("flags"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("algorithm"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("key_type"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("digest_type"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("digest_algorithm"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("digest"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("ds"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("key_tag"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("public_key"), knownvalue.NotNull()),
				},
				ExpectNonEmptyPlan: true, // Data source depends on DNSSEC resource with changing computed values
			},
		},
	})
}


func testAccZenthcloudZoneDNSSECConfig(zoneID string, name string) string {
	return fmt.Sprintf(`
data "zenthcloud_zone_dnssec" "%s" {
	zone_id = zenthcloud_zone_dnssec.%s.zone_id
}

%s
`, name, name, testAccZenthcloudZoneDNSSECResourceConfig(zoneID, name))
}

func testAccZenthcloudZoneDNSSECResourceConfig(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourceconfig.tf", name, zoneID)
}
