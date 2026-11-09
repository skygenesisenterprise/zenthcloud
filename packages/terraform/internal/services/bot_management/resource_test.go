package bot_management_test

import (
	"context"
	"os"
	"regexp"
	"testing"

	"github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_bot_management", &resource.Sweeper{
		Name: "zenthcloud_bot_management",
		F:    testSweepZenthcloudBotManagement,
	})
}

func testSweepZenthcloudBotManagement(r string) error {
	ctx := context.Background()
	// Bot Management is a zone-level configuration for bot detection settings.
	// It's a singleton configuration per zone, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Bot Management doesn't require sweeping (zone settings)")
	return nil
}

func TestAccZenthcloudBotManagement_SBFM(t *testing.T) {
	t.Skip("needs SBFM entitlements to run")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")

	sbfmConfig := zenthcloud.BotManagement{
		EnableJS:                     zenthcloud.BoolPtr(true),
		SBFMDefinitelyAutomated:      zenthcloud.StringPtr("managed_challenge"),
		SBFMLikelyAutomated:          zenthcloud.StringPtr("block"),
		SBFMVerifiedBots:             zenthcloud.StringPtr("allow"),
		SBFMStaticResourceProtection: zenthcloud.BoolPtr(false),
		OptimizeWordpress:            zenthcloud.BoolPtr(true),
	}

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementSBFM(rnd, zoneID, sbfmConfig),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_definitely_automated"), knownvalue.StringExact("managed_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_likely_automated"), knownvalue.StringExact("block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_verified_bots"), knownvalue.StringExact("allow")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_static_resource_protection"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("optimize_wordpress"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Unentitled(t *testing.T) {
	t.Skip("Test expects entitlement error but test zone entitlements allow the configuration")

	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	bmEntConfig := zenthcloud.BotManagement{
		EnableJS:             zenthcloud.BoolPtr(true),
		SuppressSessionScore: zenthcloud.BoolPtr(false),
		AutoUpdateModel:      zenthcloud.BoolPtr(false),
	}

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testZenthcloudBotManagementEntSubscription(rnd, zoneID, bmEntConfig),
				ExpectError: regexp.MustCompile("zone not entitled to disable"),
			},
		},
	})
}

func TestAccZenthcloudBotManagement_EnableJS(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementEnableJS(rnd, zoneID, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(false)),
				},
			},
			{
				Config: testZenthcloudBotManagementEnableJS(rnd, zoneID, true),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"ai_bots_protection",
					"crawler_protection",
					"stale_zone_configuration",
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_SuppressSessionScore(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementSuppressSessionScore(rnd, zoneID, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("suppress_session_score"), knownvalue.Bool(false)),
				},
			},
			{
				Config: testZenthcloudBotManagementSuppressSessionScore(rnd, zoneID, true),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("suppress_session_score"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"ai_bots_protection",
					"crawler_protection",
					"stale_zone_configuration",
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_AutoUpdateModel_Unentitled(t *testing.T) {
	t.Skip("needs SBFM entitlements to run")
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testZenthcloudBotManagementAutoUpdateModel(rnd, zoneID, false),
				ExpectError: regexp.MustCompile("zone not entitled to disable"),
			},
		},
	})
}

func TestAccZenthcloudBotManagement_AIBotsProtection(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementAIBotsProtection(rnd, zoneID, "block"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("ai_bots_protection"), knownvalue.StringExact("block")),
				},
			},
			{
				Config: testZenthcloudBotManagementAIBotsProtection(rnd, zoneID, "disabled"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("ai_bots_protection"), knownvalue.StringExact("disabled")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudBotManagement_StateConsistency(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementStateConsistency(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_update_model"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
				},
			},
			{
				Config: testZenthcloudBotManagementStateConsistency(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_update_model"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"ai_bots_protection",
					"crawler_protection",
					"stale_zone_configuration",
					"fight_mode",
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_FieldPermutations_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementBasicPermutation(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("suppress_session_score"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("ai_bots_protection"), knownvalue.StringExact("block")),
				},
			},
			{
				Config: testZenthcloudBotManagementUpdatedPermutation(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("suppress_session_score"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("ai_bots_protection"), knownvalue.StringExact("disabled")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudBotManagement_FieldPermutations_SBFM(t *testing.T) {
	t.Skip("needs SBFM entitlements to run")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementSBFMPermutation1(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_definitely_automated"), knownvalue.StringExact("block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_likely_automated"), knownvalue.StringExact("managed_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_verified_bots"), knownvalue.StringExact("allow")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_static_resource_protection"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testZenthcloudBotManagementSBFMPermutation2(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_definitely_automated"), knownvalue.StringExact("managed_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_likely_automated"), knownvalue.StringExact("allow")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_verified_bots"), knownvalue.StringExact("allow")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_static_resource_protection"), knownvalue.Bool(false)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudBotManagement_SuppressSessionScore_Issue5519(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementIssue5519(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testZenthcloudBotManagementIssue5519(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Issue5519_LifecycleIgnoreChanges(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementIssue5519Lifecycle(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testZenthcloudBotManagementIssue5519Lifecycle(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Issue5519_MinimalConfig(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementMinimalConfig(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
				},
			},
			{
				Config: testZenthcloudBotManagementMinimalConfig(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Issue5519_ExistingResourceDrift(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementIssue5519ExistingResourceConfig(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("ai_bots_protection"), knownvalue.StringExact("block")),
				},
			},
			{
				Config: testZenthcloudBotManagementIssue5519ExistingResourceConfig(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Issue5519_PlanMismatch(t *testing.T) {
	t.Skip("needs SBFM entitlements to run")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementIssue5519PlanMismatch(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_definitely_automated"), knownvalue.StringExact("block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sbfm_verified_bots"), knownvalue.StringExact("allow")),
				},
			},
			{
				Config: testZenthcloudBotManagementIssue5519PlanMismatch(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Issue5519_AutoUpdateModelNull(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementIssue5519AutoUpdate(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testZenthcloudBotManagementIssue5519AutoUpdate(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Issue5519_NullFieldDrift(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementIssue5519NullFields(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testZenthcloudBotManagementIssue5519NullFields(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_Issue5519_REPRODUCED(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementIssue5519Reproduce(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
				},
			},
			{
				Config: testZenthcloudBotManagementIssue5519Reproduce(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_ComputedFields(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementComputedFields(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_update_model"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("using_latest_model"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("is_robots_txt_managed"), knownvalue.Bool(false)),
				},
			},
			{
				Config: testZenthcloudBotManagementComputedFields(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_AutoUpdateModelStateConsistency(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementAutoUpdateModelStateConsistency(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_update_model"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
				},
			},
			{
				Config: testZenthcloudBotManagementAutoUpdateModelStateConsistency(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_update_model"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"ai_bots_protection",
					"crawler_protection",
					"stale_zone_configuration",
					"fight_mode",
				},
			},
		},
	})
}

func TestAccZenthcloudBotManagement_EnableJSAutoUpdateSuppression(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_bot_management." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudBotManagementEnableJSAutoUpdateSupression(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enable_js"), knownvalue.Bool(false)),
				},
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionCreate),
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("enable_js"),
							knownvalue.Bool(false),
						),
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("auto_update_model"),
							knownvalue.Bool(true),
						),
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("suppress_session_score"),
							knownvalue.Bool(false),
						),
					},
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"ai_bots_protection",
					"ai_training",
					"crawler_protection",
					"stale_zone_configuration",
				},
			},
		},
	})
}

func testZenthcloudBotManagementAIBotsProtection(resourceName, zoneID string, aiBotsProtection string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementaibotsprotection.tf", resourceName, zoneID, aiBotsProtection)
}

func testZenthcloudBotManagementStateConsistency(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementstateconsistency.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementAutoUpdateModelStateConsistency(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementautoupdatemodelstateconsistency.tf", resourceName, zoneID)
}

func TestAccZenthcloudBotManagement_AutoUpdateModelStateConsistency_UserZone(t *testing.T) {
	// Test against zones with different entitlement levels:
	// - ZENTHCLOUD_ZONE_ID: Entitled zone that returns all fields in API responses
	// - ZENTHCLOUD_ALT_ZONE_ID: Non-entitled zone that omits certain fields from API responses
	testCases := []struct {
		name   string
		zoneID string
	}{
		{"StandardZone", os.Getenv("ZENTHCLOUD_ZONE_ID")},
		{"AltZone", os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.name == "AltZone" {
				t.Skip("Skipping: AltZone does not have bot management write permissions in the test account")
			}
			rnd := utils.GenerateRandomResourceName()
			resourceName := "zenthcloud_bot_management." + rnd

			resource.Test(t, resource.TestCase{
				PreCheck:                 func() { acctest.TestAccPreCheck(t) },
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Steps: []resource.TestStep{
					{
						Config: testZenthcloudBotManagementAutoUpdateModelStateConsistencyUserZone(rnd, tc.zoneID),
						ConfigStateChecks: []statecheck.StateCheck{
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(tc.zoneID)),
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_update_model"), knownvalue.Bool(true)),
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
						},
					},
					{
						Config: testZenthcloudBotManagementAutoUpdateModelStateConsistencyUserZone(rnd, tc.zoneID),
						ConfigPlanChecks: resource.ConfigPlanChecks{
							PreApply: []plancheck.PlanCheck{
								plancheck.ExpectEmptyPlan(),
							},
						},
						ConfigStateChecks: []statecheck.StateCheck{
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_update_model"), knownvalue.Bool(true)),
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
						},
					},
				},
			})
		})
	}
}

func testZenthcloudBotManagementAutoUpdateModelStateConsistencyUserZone(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementautoupdatemodelstateconsistencyuserzone.tf", resourceName, zoneID)
}

func TestAccZenthcloudBotManagement_FightModeStateConsistency(t *testing.T) {
	// Test against zones with different entitlement levels:
	// - ZENTHCLOUD_ZONE_ID: Entitled zone that returns all fields in API responses
	// - ZENTHCLOUD_ALT_ZONE_ID: Non-entitled zone that omits certain fields from API responses
	testCases := []struct {
		name   string
		zoneID string
	}{
		{"StandardZone", os.Getenv("ZENTHCLOUD_ZONE_ID")},
		{"AltZone", os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.name == "AltZone" {
				t.Skip("Skipping: AltZone does not have bot management write permissions in the test account")
			}
			rnd := utils.GenerateRandomResourceName()
			resourceName := "zenthcloud_bot_management." + rnd

			resource.Test(t, resource.TestCase{
				PreCheck:                 func() { acctest.TestAccPreCheck(t) },
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Steps: []resource.TestStep{
					{
						Config: testZenthcloudBotManagementFightModeStateConsistency(rnd, tc.zoneID),
						ConfigStateChecks: []statecheck.StateCheck{
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(tc.zoneID)),
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
						},
					},
					{
						Config: testZenthcloudBotManagementFightModeStateConsistency(rnd, tc.zoneID),
						ConfigPlanChecks: resource.ConfigPlanChecks{
							PreApply: []plancheck.PlanCheck{
								plancheck.ExpectEmptyPlan(),
							},
						},
						ConfigStateChecks: []statecheck.StateCheck{
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("fight_mode"), knownvalue.Bool(false)),
						},
					},
				},
			})
		})
	}
}

func testZenthcloudBotManagementFightModeStateConsistency(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementfightmodeconsistency.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementBasicPermutation(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementbasicpermutation.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementUpdatedPermutation(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementupdatedpermutation.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementSBFMPermutation1(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementsbfmpermutation1.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementSBFMPermutation2(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementsbfmpermutation2.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementComputedFields(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementcomputedfields.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519Lifecycle(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519lifecycle.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementMinimalConfig(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementminimal.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519ExistingResourceConfig(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519existing.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519Exact(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519exact.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519PlanMismatch(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519planmismatch.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519AutoUpdate(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519autoupdate.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519NullFields(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519nullfields.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementIssue5519Reproduce(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementissue5519reproduce.tf", resourceName, zoneID)
}

func testZenthcloudBotManagementSBFM(resourceName, rnd string, bm zenthcloud.BotManagement) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementsbfm.tf", resourceName, rnd,
		*bm.EnableJS, *bm.SBFMDefinitelyAutomated,
		*bm.SBFMLikelyAutomated, *bm.SBFMVerifiedBots,
		*bm.SBFMStaticResourceProtection, *bm.OptimizeWordpress)
}

func testZenthcloudBotManagementEntSubscription(resourceName, zoneID string, bm zenthcloud.BotManagement) string {
	return acctest.LoadTestCase("zenthcloudbotmanagemententsubscription.tf", resourceName, zoneID, *bm.EnableJS, *bm.SuppressSessionScore, false)
}

func testZenthcloudBotManagementEnableJS(resourceName, zoneID string, enableJS bool) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementenablejs.tf", resourceName, zoneID, enableJS)
}

func testZenthcloudBotManagementSuppressSessionScore(resourceName, zoneID string, suppressSessionScore bool) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementsuppresssessionscore.tf", resourceName, zoneID, suppressSessionScore)
}

func testZenthcloudBotManagementAutoUpdateModel(resourceName, zoneID string, autoUpdateModel bool) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementautoupdatemodel.tf", resourceName, zoneID, autoUpdateModel)
}

func testZenthcloudBotManagementEnableJSAutoUpdateSupression(resourceName, zoneID string) string {
	return acctest.LoadTestCase("zenthcloudbotmanagementenablejsautoupdatesupression.tf", resourceName, zoneID)
}

func TestAccUpgradeBotManagement_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	config := testZenthcloudBotManagementEnableJS(rnd, zoneID, false)

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
				Config: config,
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}
