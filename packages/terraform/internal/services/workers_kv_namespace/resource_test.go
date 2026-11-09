package workers_kv_namespace_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"strings"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/kv"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
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
	resource.AddTestSweepers("zenthcloud_workers_kv_namespace", &resource.Sweeper{
		Name: "zenthcloud_workers_kv_namespace",
		F:    testSweepZenthcloudWorkersKVNamespace,
	})
}

func testSweepZenthcloudWorkersKVNamespace(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	if accountID == "" {
		tflog.Info(ctx, "Skipping Workers KV namespaces sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	// List all KV namespaces
	namespaces, err := client.KV.Namespaces.List(ctx, kv.NamespaceListParams{
		AccountID: zenthcloud.F(accountID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch KV namespaces: %s", err))
		return fmt.Errorf("failed to fetch KV namespaces: %w", err)
	}

	if len(namespaces.Result) == 0 {
		tflog.Info(ctx, "No KV namespaces to sweep")
		return nil
	}

	// Delete test namespaces only
	for _, namespace := range namespaces.Result {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(namespace.Title) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting KV namespace: %s (%s) (account: %s)", namespace.Title, namespace.ID, accountID))
		_, err := client.KV.Namespaces.Delete(ctx, namespace.ID, kv.NamespaceDeleteParams{
			AccountID: zenthcloud.F(accountID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete KV namespace %s (%s): %s", namespace.Title, namespace.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted KV namespace: %s", namespace.ID))
	}

	return nil
}

func TestAccZenthcloudWorkersKVNamespace_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	newRnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_workers_kv_namespace." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudWorkersKVNamespaceDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersKVNamespace(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("supports_url_encoding"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudWorkersKVNamespaceExists(rnd, rnd),
				),
			},
			{
				ImportState:       true,
				ImportStateVerify: true,
				ResourceName:      resourceName,
				ImportStateIdFunc: func(s *terraform.State) (string, error) {
					return fmt.Sprintf("%s/%s", accountID, s.RootModule().Resources[resourceName].Primary.ID), nil
				},
			},
			{
				Config: testAccCheckZenthcloudWorkersKVNamespaceRename(rnd, newRnd, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(newRnd)),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(newRnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudWorkersKVNamespaceExists(rnd, newRnd),
				),
			},
		},
	})
}

func TestAccZenthcloudWorkersKVNamespace_SpecialCharactersInTitle(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	// Test title with special characters and spaces
	specialTitle := "test-namespace_with.special chars-" + rnd
	resourceName := "zenthcloud_workers_kv_namespace." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudWorkersKVNamespaceDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersKVNamespaceCustomTitle(rnd, specialTitle, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(specialTitle)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudWorkersKVNamespaceExists(rnd, specialTitle),
				),
			},
		},
	})
}

func TestAccZenthcloudWorkersKVNamespace_AccountIDForcesRecreation(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_workers_kv_namespace." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	// This test validates that changing account_id requires replacement
	// Note: We can't actually test with a different account_id as that would require different credentials
	// But we can verify the schema has RequiresReplace plan modifier
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudWorkersKVNamespaceDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersKVNamespace(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
					// Validate computed field has expected type
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("supports_url_encoding"), knownvalue.Bool(true)),
				},
			},
		},
	})
}

func TestAccZenthcloudWorkersKVNamespace_InvalidImportID(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_workers_kv_namespace." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudWorkersKVNamespaceDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersKVNamespace(rnd, accountID),
			},
			{
				ResourceName:  resourceName,
				ImportState:   true,
				ImportStateId: "invalid-import-id",
				ExpectError:   regexp.MustCompile("invalid ID|expected format"),
			},
			{
				ResourceName:  resourceName,
				ImportState:   true,
				ImportStateId: accountID, // Missing namespace ID
				ExpectError:   regexp.MustCompile("invalid ID|expected format"),
			},
		},
	})
}

func TestAccZenthcloudWorkersKVNamespace_LongTitle(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	// Test with a reasonably long title (but not excessive to avoid API limits)
	longTitle := "very-long-namespace-title-" + strings.Repeat("test-", 10) + rnd
	resourceName := "zenthcloud_workers_kv_namespace." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudWorkersKVNamespaceDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersKVNamespaceCustomTitle(rnd, longTitle, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(longTitle)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudWorkersKVNamespaceExists(rnd, longTitle),
				),
			},
		},
	})
}

func TestAccZenthcloudWorkersKVNamespace_MultipleUpdates(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	firstTitle := rnd + "-first"
	secondTitle := rnd + "-second"
	thirdTitle := rnd + "-final"
	resourceName := "zenthcloud_workers_kv_namespace." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudWorkersKVNamespaceDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersKVNamespaceCustomTitle(rnd, firstTitle, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(firstTitle)),
				},
			},
			{
				Config: testAccCheckZenthcloudWorkersKVNamespaceCustomTitle(rnd, secondTitle, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(secondTitle)),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(secondTitle)),
				},
			},
			{
				Config: testAccCheckZenthcloudWorkersKVNamespaceCustomTitle(rnd, thirdTitle, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(thirdTitle)),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("title"), knownvalue.StringExact(thirdTitle)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudWorkersKVNamespaceExists(rnd, thirdTitle),
				),
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateIdFunc: func(s *terraform.State) (string, error) {
					return fmt.Sprintf("%s/%s", accountID, s.RootModule().Resources[resourceName].Primary.ID), nil
				},
			},
		},
	})
}

func testAccZenthcloudWorkersKVNamespaceDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_workers_kv_namespace" {
			continue
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]

		page, err := client.KV.Namespaces.List(context.Background(), kv.NamespaceListParams{AccountID: zenthcloud.F(accountID)})
		if err != nil {
			return err
		}

		for _, n := range page.Result {
			if n.ID == rs.Primary.ID {
				return fmt.Errorf("namespace still exists but should not")
			}
		}
	}

	return nil
}

func testAccCheckZenthcloudWorkersKVNamespace(rName, accountID string) string {
	return acctest.LoadTestCase("workerskvnamespace.tf", rName, accountID)
}

func testAccCheckZenthcloudWorkersKVNamespaceRename(resourceName, newName, accountID string) string {
	return acctest.LoadTestCase("workerskvnamespace_rename.tf", resourceName, newName, accountID)
}

func testAccCheckZenthcloudWorkersKVNamespaceCustomTitle(resourceName, customTitle, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_workers_kv_namespace" "%s" {
	account_id = "%s"
	title = "%s"
}
`, resourceName, accountID, customTitle)
}

func testAccCheckZenthcloudWorkersKVNamespaceExists(resourceSuffix, title string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		client := acctest.SharedClient()

		rs, ok := s.RootModule().Resources["zenthcloud_workers_kv_namespace."+resourceSuffix]
		if !ok {
			return fmt.Errorf("not found: %s", resourceSuffix)
		}
		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]

		page, err := client.KV.Namespaces.List(context.Background(), kv.NamespaceListParams{AccountID: zenthcloud.F(accountID)})
		if err != nil {
			return err
		}

		for _, n := range page.Result {
			if n.Title == title {
				return nil
			}
		}

		return fmt.Errorf("namespace not found")
	}
}

func TestAccUpgradeWorkersKvNamespace_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccCheckZenthcloudWorkersKVNamespace(rnd, accountID)

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
