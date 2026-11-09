package zone_dnssec_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/dns"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zone_dnssec", &resource.Sweeper{
		Name: "zenthcloud_zone_dnssec",
		F:    testSweepZenthcloudZoneDNSSEC,
	})
}

func testSweepZenthcloudZoneDNSSEC(r string) error {
	ctx := context.Background()
	// Zone DNSSEC is a zone-level DNSSEC configuration setting.
	// It's a singleton setting per zone, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Zone DNSSEC doesn't require sweeping (zone setting)")
	return nil
}

func TestAccZenthcloudZoneDNSSECFull(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneDNSSECResourceConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("flags"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("algorithm"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("key_type"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("digest_type"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("digest_algorithm"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("digest"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("ds"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("key_tag"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("public_key"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
				},
				ExpectNonEmptyPlan: true, // DNSSEC computed values can change, causing plan drift
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneDNSSECBasicConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					// Basic test: only status is specified, other optional attributes are null
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Null()),
					// Computed attributes may be null initially but populated when DNSSEC becomes active
				},
				ExpectNonEmptyPlan: true, // DNSSEC computed values can change
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_StatusDisabled(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			// First activate DNSSEC
			{
				Config: testAccZenthcloudZoneDNSSECBasicConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
				},
				ExpectNonEmptyPlan: true,
			},
			// Then disable it
			{
				Config: testAccZenthcloudZoneDNSSECDisabledConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("disabled|pending-disabled"))),
					// Other optional attributes should be null
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Null()),
				},
				ExpectNonEmptyPlan: true, // Previous tests may have left DNSSEC settings that cause drift
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_MultiSigner(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneDNSSECMultiSignerConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Bool(true)),
					// Other optional attributes should be null
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Null()),
				},
				ExpectNonEmptyPlan: true,
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_Presigned(t *testing.T) {
	t.Skip(`Skipping due to auth error:  {"success":false,"errors":[{"code":10000,"message":"Authentication error"}]}`)
	// Presigned DNSSEC requires a secondary zone
	secondaryZoneID := os.Getenv("ZENTHCLOUD_SECONDARY_ZONE_ID")
	if secondaryZoneID == "" {
		// Use dedicated secondary zone created specifically for presigned DNSSEC testing
		// Zone: secondary.terraform.cfapi.net (type: secondary)
		secondaryZoneID = "e3f462b432dd82b7329cc29bbbb4e8a6"
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneDNSSECPresignedConfig(secondaryZoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(secondaryZoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Bool(true)),
					// Other optional attributes should be null
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Null()),
				},
				ExpectNonEmptyPlan: true,
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_PresignedWithNsec3(t *testing.T) {
	// Presigned DNSSEC with NSEC3 requires a secondary zone and higher-tier plan
	secondaryZoneID := os.Getenv("ZENTHCLOUD_SECONDARY_ZONE_ID")
	if secondaryZoneID == "" {
		// Use dedicated secondary zone created specifically for presigned DNSSEC testing
		// Zone: secondary.terraform.cfapi.net (type: secondary)
		secondaryZoneID = "e3f462b432dd82b7329cc29bbbb4e8a6"
	}

	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		// No CheckDestroy - test expects error, no resource created
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudZoneDNSSECPresignedWithNsec3Config(secondaryZoneID, rnd),
				ExpectError: regexp.MustCompile("Invalid zone plan for action|failed to make http request"),
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_UseNsec3(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneDNSSECUseNsec3Config(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Bool(true)),
					// Other optional attributes should be null
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Null()),
				},
				ExpectNonEmptyPlan: true,
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_Comprehensive(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneDNSSECComprehensiveConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Bool(true)),
					// Computed attributes may be null when DNSSEC is still pending
					// They'll be populated once DNSSEC becomes fully active
				},
				ExpectNonEmptyPlan: true,
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func TestAccZenthcloudZoneDNSSEC_Update(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_dnssec.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneDNSSECDestroy,
		Steps: []resource.TestStep{
			// Start with basic configuration (status active, no optional attributes)
			{
				Config: testAccZenthcloudZoneDNSSECBasicConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Null()),
				},
				ExpectNonEmptyPlan: true,
			},
			// Update to multi-signer configuration (safer transition)
			{
				Config: testAccZenthcloudZoneDNSSECMultiSignerConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Null()),
				},
				ExpectNonEmptyPlan: true,
			},
			// Update back to basic configuration (status active, optional attributes removed)
			{
				Config: testAccZenthcloudZoneDNSSECBasicConfig(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringRegexp(regexp.MustCompile("active|pending"))),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_multi_signer"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_presigned"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("dnssec_use_nsec3"), knownvalue.Null()),
					// Computed values retain their previous values even when optional attributes are removed
				},
				ExpectNonEmptyPlan: true,
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"algorithm", "digest", "digest_algorithm", "digest_type",
					"ds", "flags", "key_tag", "key_type", "modified_on",
					"public_key", "status", "dnssec_multi_signer", "dnssec_presigned", "dnssec_use_nsec3",
				},
			},
		},
	})
}

func testAccCheckZenthcloudZoneDNSSECDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zone_dnssec" {
			continue
		}

		zoneID := rs.Primary.Attributes[consts.ZoneIDSchemaKey]
		dnssec, err := client.DNS.DNSSEC.Get(context.Background(), dns.DNSSECGetParams{
			ZoneID: zenthcloud.F(zoneID),
		})
		if err != nil {
			// DNSSEC API can return errors when checking status, which is acceptable for destroy check
			continue
		}

		// DNSSEC is considered destroyed when status is disabled or null
		if dnssec.Status != "disabled" && dnssec.Status != "" {
			return fmt.Errorf("zone dnssec still active, status: %s", dnssec.Status)
		}
	}

	return nil
}

func testAccZenthcloudZoneDNSSECBasicConfig(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourcebasic.tf", name, zoneID)
}

func testAccZenthcloudZoneDNSSECDisabledConfig(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourcedisabled.tf", name, zoneID)
}

func testAccZenthcloudZoneDNSSECMultiSignerConfig(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourcemultisigner.tf", name, zoneID)
}

func testAccZenthcloudZoneDNSSECPresignedConfig(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourcepresigned.tf", name, zoneID)
}

func testAccZenthcloudZoneDNSSECUseNsec3Config(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourcensec3.tf", name, zoneID)
}

func testAccZenthcloudZoneDNSSECComprehensiveConfig(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourcecomprehensive.tf", name, zoneID)
}

func testAccZenthcloudZoneDNSSECPresignedWithNsec3Config(zoneID string, name string) string {
	return acctest.LoadTestCase("zonednssecresourcepresignednsec3.tf", name, zoneID)
}

func TestAccUpgradeZoneDnssec_FromPublishedV5(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccZenthcloudZoneDNSSECResourceConfig(zoneID, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() { acctest.TestAccPreCheck(t) },
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.16.0",
					},
				},
				Config:             config,
				ExpectNonEmptyPlan: true,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectNonEmptyPlan(),
					},
				},
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
				ExpectNonEmptyPlan:       true,
			},
		},
	})
}
