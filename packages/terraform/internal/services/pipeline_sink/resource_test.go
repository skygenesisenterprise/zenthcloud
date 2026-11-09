package pipeline_sink_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/pipelines"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudPipelineSink_R2(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	accessKeyID := os.Getenv("ZENTHCLOUD_R2_ACCESS_KEY_ID")
	accessKeySecret := os.Getenv("ZENTHCLOUD_R2_ACCESS_KEY_SECRET")
	resourceName := "zenthcloud_pipeline_sink." + rnd

	if accessKeyID == "" {
		t.Skip("ZENTHCLOUD_R2_ACCESS_KEY_ID must be set for this acceptance test")
	}
	if accessKeySecret == "" {
		t.Skip("ZENTHCLOUD_R2_ACCESS_KEY_SECRET must be set for this acceptance test")
	}

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPipelineSinkDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccPipelineSinkR2Config(rnd, accountID, accessKeyID, accessKeySecret),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectNonEmptyPlan(),
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionCreate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("r2")),
					},
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("r2")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"config"},
			},
		},
	})
}

func TestAccZenthcloudPipelineSink_R2DataCatalog(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_pipeline_sink." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPipelineSinkDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccPipelineSinkR2DCConfig(rnd, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectNonEmptyPlan(),
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionCreate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("r2_data_catalog")),
					},
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("r2_data_catalog")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"config"},
			},
		},
	})
}

func testAccCheckZenthcloudPipelineSinkDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_pipeline_sink" {
			continue
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		sinkID := rs.Primary.ID

		_, err := client.Pipelines.Sinks.Get(
			context.Background(),
			sinkID,
			pipelines.SinkGetParams{
				AccountID: zenthcloud.F(accountID),
			},
		)
		if err == nil {
			return fmt.Errorf("pipeline sink %s still exists", sinkID)
		}
	}

	return nil
}

func testAccPipelineSinkR2Config(rnd, accountID, accessKeyID, accessKeySecret string) string {
	return acctest.LoadTestCase("pipeline_sink_r2.tf", rnd, accountID, accessKeyID, accessKeySecret)
}

func testAccPipelineSinkR2DCConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("pipeline_sink_r2dc.tf", rnd, accountID)
}
