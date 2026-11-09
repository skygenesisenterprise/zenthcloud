package queue_consumer_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	cfv1 "github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/queues"
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
	resource.AddTestSweepers("zenthcloud_queue_consumer", &resource.Sweeper{
		Name: "zenthcloud_queue_consumer",
		F:    testSweepZenthcloudQueueConsumers,
	})
}

func testSweepZenthcloudQueueConsumers(r string) error {
	ctx := context.Background()
	clientV1, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}
	clientV6 := acctest.SharedClient()

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping queue consumers sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	// List all queues using v1 client
	queuesResp, _, err := clientV1.ListQueues(ctx, cfv1.AccountIdentifier(accountID), cfv1.ListQueuesParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch queues: %s", err))
		return fmt.Errorf("failed to fetch queues: %w", err)
	}

	if len(queuesResp) == 0 {
		tflog.Info(ctx, "No queues found, skipping queue consumers sweep")
		return nil
	}

	// For each queue, list and delete its consumers
	for _, queue := range queuesResp {
		// Only process queues that would be swept themselves
		if !utils.ShouldSweepResource(queue.Name) {
			continue
		}

		consumersPage, err := clientV6.Queues.Consumers.List(ctx, queue.ID, queues.ConsumerListParams{
			AccountID: zenthcloud.F(accountID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to fetch consumers for queue %s: %s", queue.Name, err))
			continue
		}

		for _, consumer := range consumersPage.Result {
			tflog.Info(ctx, fmt.Sprintf("Deleting queue consumer: %s (queue: %s, account: %s)", consumer.ConsumerID, queue.Name, accountID))
			_, err := clientV6.Queues.Consumers.Delete(ctx, queue.ID, consumer.ConsumerID, queues.ConsumerDeleteParams{
				AccountID: zenthcloud.F(accountID),
			})
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete queue consumer %s: %s", consumer.ConsumerID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted queue consumer: %s", consumer.ConsumerID))
		}
	}

	return nil
}

func TestAccZenthcloudQueueConsumer_Worker_UpdateDeadLetterQueue(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	dlq1 := "dlq-1-" + rnd
	dlq2 := "dlq-2-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerWorkerWithDeadLetter(rnd, accountID, queueName, dlq1),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("worker")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("dead_letter_queue"), knownvalue.StringExact(dlq1)),
				},
			},
			{
				Config: testAccCheckZenthcloudQueueConsumerWorkerWithDeadLetterUpdate(rnd, accountID, queueName, dlq1, dlq2),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("worker")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("dead_letter_queue"), knownvalue.StringExact(dlq2)),
				},
			},
		},
	})
}

func TestAccZenthcloudQueueConsumer_HttpPull_UpdateDeadLetterQueue(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	dlq1 := "dlq-1-" + rnd
	dlq2 := "dlq-2-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerHttpPullWithDeadLetter(rnd, accountID, queueName, dlq1),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("http_pull")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("dead_letter_queue"), knownvalue.StringExact(dlq1)),
				},
			},
			{
				Config: testAccCheckZenthcloudQueueConsumerHttpPullWithDeadLetterUpdate(rnd, accountID, queueName, dlq1, dlq2),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("http_pull")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("dead_letter_queue"), knownvalue.StringExact(dlq2)),
				},
			},
		},
	})
}

func TestAccZenthcloudQueueConsumer_HttpPull_UpdateSettings(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerHttpPullWithSettings(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("http_pull")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("batch_size"), knownvalue.Float64Exact(10)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_retries"), knownvalue.Float64Exact(3)),
				},
			},
			{
				Config: testAccCheckZenthcloudQueueConsumerHttpPullWithSettingsUpdate(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("http_pull")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("batch_size"), knownvalue.Float64Exact(20)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_retries"), knownvalue.Float64Exact(5)),
				},
			},
		},
	})
}

func testSweepZenthcloudQueueConsumer(r string) error {
	ctx := context.Background()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	if accountID == "" {
		tflog.Info(ctx, "Skipping queue consumers sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	client := acctest.SharedClient()
	if client == nil {
		tflog.Error(ctx, "Failed to create Zenthcloud client")
		return fmt.Errorf("failed to create Zenthcloud client")
	}

	// List all queues first
	queueList, err := client.Queues.List(ctx, queues.QueueListParams{
		AccountID: zenthcloud.F(accountID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to list queues: %s", err))
		return fmt.Errorf("failed to list queues: %w", err)
	}

	if len(queueList.Result) == 0 {
		tflog.Info(ctx, "No queues to sweep consumers from")
		return nil
	}

	// For each queue, list and delete consumers
	for _, queue := range queueList.Result {
		consumers, err := client.Queues.Consumers.List(ctx, queue.QueueID, queues.ConsumerListParams{
			AccountID: zenthcloud.F(accountID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to list consumers for queue %s: %s", queue.QueueID, err))
			continue
		}

		for _, consumer := range consumers.Result {
			tflog.Info(ctx, fmt.Sprintf("Deleting queue consumer: %s (queue: %s) (account: %s)", consumer.ConsumerID, queue.QueueID, accountID))
			_, err := client.Queues.Consumers.Delete(ctx, queue.QueueID, consumer.ConsumerID, queues.ConsumerDeleteParams{
				AccountID: zenthcloud.F(accountID),
			})
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete queue consumer %s: %s", consumer.ConsumerID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted queue consumer: %s", consumer.ConsumerID))
		}
	}

	return nil
}

func TestAccZenthcloudQueueConsumer_Worker(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerWorker(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("queue_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("consumer_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("worker")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("script_name"), knownvalue.StringExact("test-worker-"+rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func TestAccZenthcloudQueueConsumer_HttpPull(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerHttpPull(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("queue_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("consumer_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("http_pull")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func TestAccZenthcloudQueueConsumerWorker_WithSettings(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerWorkerWithSettings(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("queue_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("consumer_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("worker")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("script_name"), knownvalue.StringExact("test-worker-consumer-worker-with-settings")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("batch_size"), knownvalue.Float64Exact(10)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_retries"), knownvalue.Float64Exact(3)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_wait_time_ms"), knownvalue.Float64Exact(5000)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func TestAccZenthcloudQueueConsumer_Worker_Update(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerWorkerUpdateStart(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("queue_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("consumer_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("worker")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("script_name"), knownvalue.StringExact("test-worker-consumer-worker-update-script")),
				},
			},
			{
				Config: testAccCheckZenthcloudQueueConsumerWorkerUpdate(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("worker")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("script_name"), knownvalue.StringExact("test-worker-consumer-worker-update-script")),
				},
			},
		},
	})
}

func TestAccZenthcloudQueueConsumer_Worker_NoReplacementOnReplan(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd

	config := testAccCheckZenthcloudQueueConsumerWorker(rnd, accountID, queueName)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: config,
			},
			{
				Config: config,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudQueueConsumer_Worker_UpdateSettings(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	queueName := "test-queue-" + rnd
	resourceName := "zenthcloud_queue_consumer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudQueueConsumerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudQueueConsumerWorkerWithSettingsUpdateStart(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("batch_size"), knownvalue.Float64Exact(10)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_retries"), knownvalue.Float64Exact(3)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_wait_time_ms"), knownvalue.Float64Exact(5000)),
				},
			},
			{
				Config: testAccCheckZenthcloudQueueConsumerWorkerWithSettingsUpdate(rnd, accountID, queueName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("batch_size"), knownvalue.Float64Exact(20)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_retries"), knownvalue.Float64Exact(5)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("settings").AtMapKey("max_wait_time_ms"), knownvalue.Float64Exact(8000)),
				},
			},
		},
	})
}

func testAccCheckZenthcloudQueueConsumerDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_queue_consumer" {
			continue
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		queueID := rs.Primary.Attributes["queue_id"]
		consumerID := rs.Primary.Attributes["consumer_id"]

		_, err := client.Queues.Consumers.Get(
			context.Background(),
			queueID,
			consumerID,
			queues.ConsumerGetParams{
				AccountID: zenthcloud.F(accountID),
			},
		)
		if err == nil {
			return fmt.Errorf("queue consumer still exists")
		}
	}

	return nil
}

func testAccCheckZenthcloudQueueConsumerWorker(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_worker.tf", accountID, queueName, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerWorkerUpdateStart(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_worker_update_start.tf", accountID, queueName, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerWorkerUpdate(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_worker_update.tf", accountID, queueName, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerWorkerWithSettings(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_worker_with_settings.tf", accountID, queueName, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerWorkerWithSettingsUpdateStart(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_worker_with_settings_update_start.tf", accountID, queueName, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerWorkerWithSettingsUpdate(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_worker_with_settings_update.tf", accountID, queueName, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerHttpPull(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_http.tf", accountID, queueName, rnd, accountID)
}

func testAccCheckZenthcloudQueueConsumerHttpPullWithSettings(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_http_with_settings.tf", accountID, queueName, rnd, accountID)
}

func testAccCheckZenthcloudQueueConsumerHttpPullWithSettingsUpdate(rnd, accountID, queueName string) string {
	return acctest.LoadTestCase("queueconsumer_http_with_settings_update.tf", accountID, queueName, rnd, accountID)
}

func testAccCheckZenthcloudQueueConsumerWorkerWithDeadLetter(rnd, accountID, queueName, dlqName string) string {
	return acctest.LoadTestCase("queueconsumer_worker_with_dead_letter.tf", accountID, queueName, accountID, dlqName, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerWorkerWithDeadLetterUpdate(rnd, accountID, queueName, dlqName1, dlqName2 string) string {
	return acctest.LoadTestCase("queueconsumer_worker_with_dead_letter_update.tf", accountID, queueName, accountID, dlqName1, accountID, dlqName2, rnd, accountID, accountID)
}

func testAccCheckZenthcloudQueueConsumerHttpPullWithDeadLetter(rnd, accountID, queueName, dlqName string) string {
	return acctest.LoadTestCase("queueconsumer_http_with_dead_letter.tf", accountID, queueName, accountID, dlqName, rnd, accountID)
}

func testAccCheckZenthcloudQueueConsumerHttpPullWithDeadLetterUpdate(rnd, accountID, queueName, dlqName1, dlqName2 string) string {
	return acctest.LoadTestCase("queueconsumer_http_with_dead_letter_update.tf", accountID, queueName, accountID, dlqName1, accountID, dlqName2, rnd, accountID)
}
