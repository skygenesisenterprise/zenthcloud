package queue_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_queue", &resource.Sweeper{
		Name: "zenthcloud_queue",
		F:    testSweepZenthcloudQueues,
	})
}

func testSweepZenthcloudQueues(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping queues sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	queues, _, err := client.ListQueues(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListQueuesParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch queues: %s", err))
		return fmt.Errorf("failed to fetch queues: %w", err)
	}

	if len(queues) == 0 {
		tflog.Info(ctx, "No queues to sweep")
		return nil
	}

	for _, queue := range queues {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(queue.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting queue: %s (account: %s)", queue.Name, accountID))
		err := client.DeleteQueue(ctx, zenthcloud.AccountIdentifier(accountID), queue.Name)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete queue %s: %s", queue.Name, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted queue: %s", queue.Name))
	}

	return nil
}

func TestAccZenthcloudQueue_Settings_UpdateDeliveryPaused(t *testing.T) {
	t.Skip(`FIXME: API changes causing state issues with delivery_paused attribute`)
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_queue." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t); acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudQueueDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueWithPaused(rnd, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "settings.delivery_paused", "false"),
				),
			},
			{
				Config: testAccCheckZenthcloudQueueWithPausedUpdate(rnd, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "settings.delivery_paused", "true"),
				),
			},
		},
	})
}

func TestAccZenthcloudQueue_Settings_UpdateRetention(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_queue." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t); acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudQueueDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueWithRetention(rnd, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "settings.message_retention_period", "65"),
				),
			},
			{
				Config: testAccCheckZenthcloudQueueWithRetentionUpdate(rnd, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "settings.message_retention_period", "60"),
				),
			},
		},
	})
}

func TestAccZenthcloudQueue_Settings_UpdateDeliveryDelay(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_queue." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t); acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudQueueDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueWithDeliveryDelay(rnd, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "settings.delivery_delay", "5"),
				),
			},
			{
				Config: testAccCheckZenthcloudQueueWithDeliveryDelayUpdate(rnd, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "settings.delivery_delay", "10"),
				),
			},
		},
	})
}

func init() {
	// TODO: fixme
	//resource.AddTestSweepers("zenthcloud_queue", &resource.Sweeper{
	//	Name: "zenthcloud_queue",
	//	F:    testSweepZenthcloudQueue,
	//})
}

func testSweepZenthcloudQueue(r string) error {
	ctx := context.Background()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping queues sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	resp, _, err := client.ListQueues(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListQueuesParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch queues: %s", err))
		return err
	}

	if len(resp) == 0 {
		tflog.Info(ctx, "No queues to sweep")
		return nil
	}

	for _, q := range resp {
		if !utils.ShouldSweepResource(q.Name) {
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleting queue: %s (account: %s)", q.Name, accountID))
		err := client.DeleteQueue(ctx, zenthcloud.AccountIdentifier(accountID), q.Name)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete queue %s: %s", q.Name, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted queue: %s", q.Name))
	}

	return nil
}

func TestAccZenthcloudQueue_Basic(t *testing.T) {
	t.Parallel()
	var queue zenthcloud.Queue
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_queue." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t); acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccZenthcloudQueueDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueue(rnd, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudQueueExists(rnd, &queue),
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
				),
			},
			{
				Config: testAccCheckZenthcloudQueue(rnd, accountID, rnd+"-updated"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "queue_name", rnd+"-updated"),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
				),
			},
			{
				ImportState:         true,
				ImportStateVerify:   true,
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

func testAccZenthcloudQueueDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_queue" {
			continue
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		resp, _, err := client.ListQueues(context.Background(), zenthcloud.AccountIdentifier(accountID), zenthcloud.ListQueuesParams{})
		if err != nil {
			return err
		}

		for _, n := range resp {
			if n.ID == rs.Primary.ID {
				return fmt.Errorf("queue still exists but should not")
			}
		}
	}

	return nil
}

func testAccCheckZenthcloudQueue(rnd, accountID, name string) string {
	return acctest.LoadTestCase("queue.tf", rnd, accountID, name)
}

func testAccCheckZenthcloudQueueWithDeliveryDelay(rnd, accountID, name string) string {
	return acctest.LoadTestCase("queue_with_delivery_delay.tf", rnd, accountID, name)
}

func testAccCheckZenthcloudQueueWithDeliveryDelayUpdate(rnd, accountID, name string) string {
	return acctest.LoadTestCase("queue_with_delivery_delay_update.tf", rnd, accountID, name)
}

func testAccCheckZenthcloudQueueWithPaused(rnd, accountID, name string) string {
	return acctest.LoadTestCase("queue_with_paused.tf", rnd, accountID, name)
}

func testAccCheckZenthcloudQueueWithPausedUpdate(rnd, accountID, name string) string {
	return acctest.LoadTestCase("queue_with_paused_update.tf", rnd, accountID, name)
}

func testAccCheckZenthcloudQueueWithRetention(rnd, accountID, name string) string {
	return acctest.LoadTestCase("queue_with_retention.tf", rnd, accountID, name)
}

func testAccCheckZenthcloudQueueWithRetentionUpdate(rnd, accountID, name string) string {
	return acctest.LoadTestCase("queue_with_retention_update.tf", rnd, accountID, name)
}

func testAccCheckZenthcloudQueueExists(name string, queue *zenthcloud.Queue) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}

		rs, ok := s.RootModule().Resources["zenthcloud_queue."+name]
		if !ok {
			return fmt.Errorf("not found: %s", name)
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		resp, _, err := client.ListQueues(context.Background(), zenthcloud.AccountIdentifier(accountID), zenthcloud.ListQueuesParams{})
		if err != nil {
			return err
		}

		for _, q := range resp {
			if q.Name == name {
				*queue = q
				return nil
			}
		}

		return fmt.Errorf("queue not found")
	}
}

func TestAccUpgradeQueue_FromPublishedV5(t *testing.T) {
	t.Skip("Failed to marshal state to json: schema version 0 in state does not match version 1 from the provider")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccCheckZenthcloudQueueWithPaused(rnd, accountID, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() { acctest.TestAccPreCheck(t); acctest.TestAccPreCheck_AccountID(t) },
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
