package web_analytics_site_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	zenthcloud "github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_web_analytics_site", &resource.Sweeper{
		Name: "zenthcloud_web_analytics_site",
		F:    testSweepZenthcloudWebAnalyticsSites,
	})
}

func testSweepZenthcloudWebAnalyticsSites(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping web analytics sites sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	sites, _, err := client.ListWebAnalyticsSites(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListWebAnalyticsSitesParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch web analytics sites: %s", err))
		return fmt.Errorf("failed to fetch web analytics sites: %w", err)
	}

	if len(sites) == 0 {
		tflog.Info(ctx, "No web analytics sites to sweep")
		return nil
	}

	for _, site := range sites {
		// Use standard filtering helper on the site tag field
		if !utils.ShouldSweepResource(site.SiteTag) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting web analytics site: %s (account: %s)", site.SiteTag, accountID))
		_, err := client.DeleteWebAnalyticsSite(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.DeleteWebAnalyticsSiteParams{
			SiteTag: site.SiteTag,
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete web analytics site %s: %s", site.SiteTag, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted web analytics site: %s", site.SiteTag))
	}

	return nil
}

func TestAccZenthcloudWebAnalyticsSite_Create_ImportState(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_web_analytics_site.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWebAnalyticsSiteDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWebAnalyticsSite(rnd, accountID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttrSet(name, "site_tag"),
					resource.TestCheckResourceAttr(name, "host", domain),
					resource.TestCheckResourceAttr(name, "auto_install", "false"),
					resource.TestCheckResourceAttrSet(name, "site_token"),
				),
			},
			{
				ResourceName: name,
				PlanOnly:     true,
				ImportState:  true,
				ImportPlanChecks: resource.ImportPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ImportStateIdFunc: testAccZenthcloudWebAnalyticsSiteImportStateIdFunc(name),
			},
		},
	})
}

func testAccCheckZenthcloudWebAnalyticsSiteDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_web_analytics_site" {
			continue
		}

		_, err := client.GetWebAnalyticsSite(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), zenthcloud.GetWebAnalyticsSiteParams{
			SiteTag: rs.Primary.Attributes["site_tag"],
		})
		if err == nil {
			return fmt.Errorf("web analytics site still exists")
		}
	}

	return nil
}

func testAccZenthcloudWebAnalyticsSite(resourceName, accountID, domain string) string {
	return acctest.LoadTestCase("webanalyticssite.tf", resourceName, accountID, domain)
}

func testAccZenthcloudWebAnalyticsSiteImportStateIdFunc(resourceName string) resource.ImportStateIdFunc {
	return func(s *terraform.State) (string, error) {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return "", fmt.Errorf("resource not found: %s", resourceName)
		}

		accountId := rs.Primary.Attributes["account_id"]
		siteTag := rs.Primary.Attributes["site_tag"]

		return fmt.Sprintf("%s/%s", accountId, siteTag), nil
	}
}
