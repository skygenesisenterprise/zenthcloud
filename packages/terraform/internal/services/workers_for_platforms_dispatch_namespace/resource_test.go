package workers_for_platforms_dispatch_namespace_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	cfv1 "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_workers_for_platforms_dispatch_namespace", &resource.Sweeper{
		Name: "zenthcloud_workers_for_platforms_dispatch_namespace",
		F: func(region string) error {
			ctx := context.Background()
			client, err := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
			accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", err))
				return fmt.Errorf("error establishing client: %w", err)
			}

			if accountID == "" {
				tflog.Info(ctx, "Skipping Workers for Platforms dispatch namespaces sweep: ZENTHCLOUD_ACCOUNT_ID not set")
				return nil
			}

			resp, err := client.ListWorkersForPlatformsDispatchNamespaces(ctx, cfv1.AccountIdentifier(accountID))
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to fetch Workers for Platforms dispatch namespaces: %s", err))
				return fmt.Errorf("failed to fetch Workers for Platforms dispatch namespaces: %w", err)
			}

			if len(resp.Result) == 0 {
				tflog.Info(ctx, "No Workers for Platforms dispatch namespaces to sweep")
				return nil
			}

			for _, namespace := range resp.Result {
				if !utils.ShouldSweepResource(namespace.NamespaceName) {
					continue
				}

				tflog.Info(ctx, fmt.Sprintf("Deleting Workers for Platforms dispatch namespace: %s (account: %s)", namespace.NamespaceName, accountID))
				err := client.DeleteWorkersForPlatformsDispatchNamespace(ctx, cfv1.AccountIdentifier(accountID), namespace.NamespaceName)
				if err != nil {
					tflog.Error(ctx, fmt.Sprintf("Failed to delete Workers for Platforms dispatch namespace %s: %s", namespace.NamespaceName, err))
					continue
				}
				tflog.Info(ctx, fmt.Sprintf("Deleted Workers for Platforms dispatch namespace: %s", namespace.NamespaceName))
			}

			return nil
		},
	})
}

func TestAccZenthcloudWorkersForPlatforms_NamespaceManagement(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_workers_for_platforms_dispatch_namespace." + rnd

	resource.ParallelTest(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersForPlatformsNamespaceManagement(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttrSet(resourceName, "id"),
				),
			},
			// {
			// 	ResourceName:        resourceName,
			// 	ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			// 	ImportState:         true,
			// 	ImportStateVerify:   true,
			// },
		},
	})
}

func testAccCheckZenthcloudWorkersForPlatformsNamespaceManagement(rnd, accountID string) string {
	return acctest.LoadTestCase("workersforplatformsnamespacemanagement.tf", rnd, accountID)
}

func TestAccUpgradeWorkersForPlatformsDispatchNamespace_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccCheckZenthcloudWorkersForPlatformsNamespaceManagement(rnd, accountID)

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

func testAccCheckZenthcloudWorkerScriptDestroy(s *terraform.State) error {
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_workers_script" {
			continue
		}

		client, err := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if err != nil {
			return fmt.Errorf("error establishing client: %w", err)
		}
		r, _ := client.GetWorkerWithDispatchNamespace(
			context.Background(),
			cfv1.AccountIdentifier(accountID),
			rs.Primary.Attributes["name"],
			rs.Primary.Attributes["dispatch_namespace"],
		)

		if r.Script != "" {
			return fmt.Errorf("namespaced worker script with id %s still exists", rs.Primary.ID)
		}
	}

	return nil
}
