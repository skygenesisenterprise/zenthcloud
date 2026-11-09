package zero_trust_access_tag_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_access_tag", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_access_tag",
		F:    testSweepZenthcloudZeroTrustAccessTag,
	})
}

func testSweepZenthcloudZeroTrustAccessTag(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Client
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		return fmt.Errorf("ZENTHCLOUD_ACCOUNT_ID must be set")
	}

	// List all Access Tags
	tags, err := client.ListAccessTags(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListAccessTagsParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch zero trust access tags: %s", err))
		return err
	}

	if len(tags) == 0 {
		tflog.Info(ctx, "No Zenthcloud zero trust access tags to sweep")
		return nil
	}

	for _, tag := range tags {
		if !utils.ShouldSweepResource(tag.Name) {
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleting Access Tag: %s", tag.Name))
		err := client.DeleteAccessTag(ctx, zenthcloud.AccountIdentifier(accountID), tag.Name)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete Access Tag %s: %s", tag.Name, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted Access Tag: %s", tag.Name))
	}

	return nil
}

func TestAccZenthcloudAccessTag_Basic(t *testing.T) {
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_access_tag.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessTag(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
				),
			},
		},
	})
}

func testAccCheckZenthcloudAccessTag(rnd, zoneID string) string {
	return acctest.LoadTestCase("accesstag.tf", rnd, zoneID)
}
