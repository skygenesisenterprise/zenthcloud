package v500_test

import (
	_ "embed"
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/config"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

//go:embed testdata/v4_basic.tf
var testAccZenthcloudSnippetMigrationConfigBasic string

//go:embed testdata/v4_multiple_files.tf
var testAccZenthcloudSnippetMigrationConfigMultipleFiles string

//go:embed testdata/v4_complex_content.tf
var testAccZenthcloudSnippetMigrationConfigComplexContent string

//go:embed testdata/v4_url_rewrite.tf
var testAccZenthcloudSnippetMigrationConfigURLRewrite string

//go:embed testdata/v4_header_manipulation.tf
var testAccZenthcloudSnippetMigrationConfigHeaderManipulation string

//go:embed testdata/v4_edge_cases.tf
var testAccZenthcloudSnippetMigrationConfigEdgeCases string

// Configs for _Migration_ tests (zoneID=%[1]s, rnd=%[2]s arg order)

//go:embed testdata/v4_migration_basic.tf
var v4MigrationBasicConfig string

//go:embed testdata/v4_migration_multiple_files.tf
var v4MigrationMultipleFilesConfig string

//go:embed testdata/v4_migration_complex_content.tf
var v4MigrationComplexContentConfig string

// ============================================================================
// Tests ported from migrations_test.go (original PreConfig/RunMigrationV2Command style)
// ============================================================================

func TestMigrateZenthcloudSnippetBasic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_snippet.%s", rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "4.52.1",
					},
				},
				Config: fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigBasic, rnd, zoneID),
			},
			{
				PreConfig: func() {
					acctest.WriteOutConfig(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigBasic, rnd, zoneID), tmpDir)
					acctest.RunMigrationV2Command(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigBasic, rnd, zoneID), tmpDir, "v4", "v5")
				},
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				ConfigDirectory:          config.StaticDirectory(tmpDir),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						acctest.DebugNonEmptyPlan,
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("main.js")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0), knownvalue.ObjectExact(map[string]knownvalue.Check{
						"name":    knownvalue.StringExact("main.js"),
						"content": knownvalue.StringExact("export default {async fetch(request) {return fetch(request)}};"),
					})),
				},
			},
		},
	})
}

func TestMigrateZenthcloudSnippetMultipleFiles(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_snippet.%s", rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "4.52.1",
					},
				},
				Config: fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigMultipleFiles, rnd, zoneID),
			},
			{
				PreConfig: func() {
					acctest.WriteOutConfig(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigMultipleFiles, rnd, zoneID), tmpDir)
					acctest.RunMigrationV2Command(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigMultipleFiles, rnd, zoneID), tmpDir, "v4", "v5")
				},
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				ConfigDirectory:          config.StaticDirectory(tmpDir),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						acctest.DebugNonEmptyPlan,
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("main.js")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(3)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"name": knownvalue.StringExact("main.js"),
					})),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(1), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"name": knownvalue.StringExact("helper.js"),
					})),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(2), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"name":    knownvalue.StringExact("utils.js"),
						"content": knownvalue.StringExact("export const VERSION = '1.0.0';"),
					})),
				},
			},
		},
	})
}

func TestMigrateZenthcloudSnippetComplexContent(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_snippet.%s", rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "4.52.1",
					},
				},
				Config: fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigComplexContent, rnd, zoneID),
			},
			{
				PreConfig: func() {
					acctest.WriteOutConfig(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigComplexContent, rnd, zoneID), tmpDir)
					acctest.RunMigrationV2Command(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigComplexContent, rnd, zoneID), tmpDir, "v4", "v5")
				},
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				ConfigDirectory:          config.StaticDirectory(tmpDir),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						acctest.DebugNonEmptyPlan,
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("worker.js")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"name":    knownvalue.StringExact("worker.js"),
						"content": knownvalue.StringRegexp(regexp.MustCompile("Complex worker with multiple features")),
					})),
				},
			},
		},
	})
}

func TestMigrateZenthcloudSnippetWithImport(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_snippet.%s", rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "4.52.1",
					},
				},
				Config: fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigBasic, rnd, zoneID),
			},
			{
				PreConfig: func() {
					acctest.WriteOutConfig(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigBasic, rnd, zoneID), tmpDir)
					acctest.RunMigrationV2Command(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigBasic, rnd, zoneID), tmpDir, "v4", "v5")
				},
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				ConfigDirectory:          config.StaticDirectory(tmpDir),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						acctest.DebugNonEmptyPlan,
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
				},
			},
		},
	})
}

func TestMigrateZenthcloudSnippetURLRewrite(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_snippet.%s", rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "4.52.1",
					},
				},
				Config: fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigURLRewrite, rnd, zoneID),
			},
			{
				PreConfig: func() {
					acctest.WriteOutConfig(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigURLRewrite, rnd, zoneID), tmpDir)
					acctest.RunMigrationV2Command(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigURLRewrite, rnd, zoneID), tmpDir, "v4", "v5")
				},
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				ConfigDirectory:          config.StaticDirectory(tmpDir),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						acctest.DebugNonEmptyPlan,
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("rewrite.js")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"name":    knownvalue.StringExact("rewrite.js"),
						"content": knownvalue.StringRegexp(regexp.MustCompile(`pathname\.match\(/\^\\/old`)),
					})),
				},
			},
		},
	})
}

func TestMigrateZenthcloudSnippetHeaderManipulation(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_snippet.%s", rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "4.52.1",
					},
				},
				Config: fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigHeaderManipulation, rnd, zoneID),
			},
			{
				PreConfig: func() {
					acctest.WriteOutConfig(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigHeaderManipulation, rnd, zoneID), tmpDir)
					acctest.RunMigrationV2Command(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigHeaderManipulation, rnd, zoneID), tmpDir, "v4", "v5")
				},
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				ConfigDirectory:          config.StaticDirectory(tmpDir),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						acctest.DebugNonEmptyPlan,
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("headers.js")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"name":    knownvalue.StringExact("headers.js"),
						"content": knownvalue.StringRegexp(regexp.MustCompile(`headers\.set\("X-Custom-Header"`)),
					})),
				},
			},
		},
	})
}

func TestMigrateZenthcloudSnippetEdgeCases(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_snippet.%s", rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "4.52.1",
					},
				},
				Config: fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigEdgeCases, rnd, zoneID),
			},
			{
				PreConfig: func() {
					acctest.WriteOutConfig(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigEdgeCases, rnd, zoneID), tmpDir)
					acctest.RunMigrationV2Command(t, fmt.Sprintf(testAccZenthcloudSnippetMigrationConfigEdgeCases, rnd, zoneID), tmpDir, "v4", "v5")
				},
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				ConfigDirectory:          config.StaticDirectory(tmpDir),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						acctest.DebugNonEmptyPlan,
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("edge.js")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"name":    knownvalue.StringExact("edge.js"),
						"content": knownvalue.StringRegexp(regexp.MustCompile("emoji 🚀")),
					})),
				},
			},
		},
	})
}

// ============================================================================
// Tests ported from migrations_v4_to_v5_test.go (MigrationV2TestStepWithStateNormalization style)
// ============================================================================

func TestMigrateZenthcloudSnippet_Migration_Basic_MultiVersion(t *testing.T) {
	testCases := []struct {
		name     string
		version  string
		configFn func(zoneID, rnd string) string
	}{
		{
			name:     "from_v4_52_1",
			version:  "4.52.1",
			configFn: func(zoneID, rnd string) string { return fmt.Sprintf(v4MigrationBasicConfig, zoneID, rnd) },
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
			rnd := utils.GenerateRandomResourceName()
			resourceName := "zenthcloud_snippet." + rnd
			testConfig := tc.configFn(zoneID, rnd)
			tmpDir := t.TempDir()

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_ZoneID(t)
				},
				WorkingDir: tmpDir,
				Steps: append(
					[]resource.TestStep{
						{
							ExternalProviders: map[string]resource.ExternalProvider{
								"zenthcloud": {
									VersionConstraint: tc.version,
									Source:            "zenthcloud/zenthcloud",
								},
							},
							Config: testConfig,
							ConfigStateChecks: []statecheck.StateCheck{
								statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
								statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
								statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("main_module"), knownvalue.StringExact("main.js")),
							},
						},
					},
					acctest.MigrationV2TestStepWithStateNormalization(t, testConfig, tmpDir, tc.version, "v4", "v5", []statecheck.StateCheck{
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("main.js")),
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(1)),
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0).AtMapKey("name"), knownvalue.StringExact("main.js")),
					})...,
				),
			})
		})
	}
}

func TestMigrateZenthcloudSnippet_Migration_WithMultipleFiles(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_snippet." + rnd
	v4Config := fmt.Sprintf(v4MigrationMultipleFilesConfig, zoneID, rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: append(
			[]resource.TestStep{
				{
					ExternalProviders: map[string]resource.ExternalProvider{
						"zenthcloud": {
							VersionConstraint: "4.52.1",
							Source:            "zenthcloud/zenthcloud",
						},
					},
					Config: v4Config,
					ConfigStateChecks: []statecheck.StateCheck{
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					},
				},
			},
			acctest.MigrationV2TestStepWithStateNormalization(t, v4Config, tmpDir, "4.52.1", "v4", "v5", []statecheck.StateCheck{
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("main.js")),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(3)),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(0).AtMapKey("name"), knownvalue.StringExact("main.js")),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(1).AtMapKey("name"), knownvalue.StringExact("helper.js")),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files").AtSliceIndex(2).AtMapKey("name"), knownvalue.StringExact("utils.js")),
			})...,
		),
	})
}

func TestMigrateZenthcloudSnippet_Migration_ComplexContent(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_snippet." + rnd
	v4Config := fmt.Sprintf(v4MigrationComplexContentConfig, zoneID, rnd)
	tmpDir := t.TempDir()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		WorkingDir: tmpDir,
		Steps: append(
			[]resource.TestStep{
				{
					ExternalProviders: map[string]resource.ExternalProvider{
						"zenthcloud": {
							VersionConstraint: "4.52.1",
							Source:            "zenthcloud/zenthcloud",
						},
					},
					Config: v4Config,
					ConfigStateChecks: []statecheck.StateCheck{
						statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					},
				},
			},
			acctest.MigrationV2TestStepWithStateNormalization(t, v4Config, tmpDir, "4.52.1", "v4", "v5", []statecheck.StateCheck{
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("snippet_name"), knownvalue.StringExact(rnd)),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("metadata").AtMapKey("main_module"), knownvalue.StringExact("worker.js")),
				statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("files"), knownvalue.ListSizeExact(1)),
			})...,
		),
	})
}

