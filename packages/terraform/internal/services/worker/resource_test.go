package worker_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/workers"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

const resourcePrefix = "tfacctest-"

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_worker", &resource.Sweeper{
		Name: "zenthcloud_worker",
		F:    testSweepZenthcloudWorkers,
	})
}

func testSweepZenthcloudWorkers(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	if accountID == "" {
		tflog.Info(ctx, "Skipping workers sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	list, err := client.Workers.Beta.Workers.List(ctx, workers.BetaWorkerListParams{
		AccountID: zenthcloud.F(accountID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to list workers: %s", err))
		return fmt.Errorf("failed to list workers: %w", err)
	}

	hasWorkers := false
	for list != nil && len(list.Result) > 0 {
		for _, worker := range list.Result {
			hasWorkers = true
			// Use standard filtering helper
			if !utils.ShouldSweepResource(worker.ID) {
				continue
			}

			tflog.Info(ctx, fmt.Sprintf("Deleting worker: %s (account: %s)", worker.ID, accountID))
			_, err := client.Workers.Beta.Workers.Delete(ctx, worker.ID, workers.BetaWorkerDeleteParams{
				AccountID: zenthcloud.F(accountID),
			})
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete worker %s: %s", worker.ID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted worker: %s", worker.ID))
		}

		list, err = list.GetNextPage()
		if err != nil {
			break
		}
	}

	if !hasWorkers {
		tflog.Info(ctx, "No workers to sweep")
	}

	return nil
}

func TestAccZenthcloudWorker_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := resourcePrefix + rnd
	name := "zenthcloud_worker." + resourceName
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkerConfig(resourceName, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					// Verify computed attributes
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("logpush"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tags"), knownvalue.SetExact([]knownvalue.Check{})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("observability"), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"enabled":            knownvalue.Bool(false),
						"head_sampling_rate": knownvalue.Float64Exact(1),
						"logs": knownvalue.ObjectExact(map[string]knownvalue.Check{
							"destinations":       knownvalue.ListExact([]knownvalue.Check{}),
							"enabled":            knownvalue.Bool(false),
							"head_sampling_rate": knownvalue.Float64Exact(1),
							"invocation_logs":    knownvalue.Bool(true),
							"persist":            knownvalue.Bool(true),
						}),
						"traces": knownvalue.ObjectPartial(map[string]knownvalue.Check{
							"destinations":       knownvalue.ListExact([]knownvalue.Check{}),
							"enabled":            knownvalue.Bool(false),
							"head_sampling_rate": knownvalue.Float64Exact(1),
							"persist":            knownvalue.Bool(true),
						}),
					})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("subdomain"), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"enabled":          knownvalue.Bool(false),
						"previews_enabled": knownvalue.Bool(false),
					})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tail_consumers"), knownvalue.SetExact([]knownvalue.Check{})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("created_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("updated_on"), knownvalue.NotNull()),
				},
			},
			{
				Config: testAccZenthcloudWorkerConfigUpdate(resourceName, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tags"), knownvalue.SetExact([]knownvalue.Check{knownvalue.StringExact("environment=production")})),
					// Verify computed attributes
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("logpush"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("observability"), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"enabled":            knownvalue.Bool(false),
						"head_sampling_rate": knownvalue.Float64Exact(1),
						"logs": knownvalue.ObjectExact(map[string]knownvalue.Check{
							"destinations":       knownvalue.ListExact([]knownvalue.Check{}),
							"enabled":            knownvalue.Bool(false),
							"head_sampling_rate": knownvalue.Float64Exact(1),
							"invocation_logs":    knownvalue.Bool(true),
							"persist":            knownvalue.Bool(true),
						}),
						"traces": knownvalue.ObjectPartial(map[string]knownvalue.Check{
							"destinations":       knownvalue.ListExact([]knownvalue.Check{}),
							"enabled":            knownvalue.Bool(false),
							"head_sampling_rate": knownvalue.Float64Exact(1),
							"persist":            knownvalue.Bool(true),
						}),
					})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("subdomain"), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"enabled":          knownvalue.Bool(false),
						"previews_enabled": knownvalue.Bool(false),
					})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tail_consumers"), knownvalue.SetExact([]knownvalue.Check{})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("created_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("updated_on"), knownvalue.NotNull()),
				},
			},
			{
				// Import using an import block and assert there are no changes
				// reported in the import plan.
				Config:       testAccZenthcloudWorkerConfigUpdate(resourceName, accountID),
				ResourceName: name,
				ImportStateIdFunc: resource.ImportStateIdFunc(func(state *terraform.State) (string, error) {
					workerId := state.RootModule().Resources[name].Primary.ID
					return fmt.Sprintf("%s/%s", accountID, workerId), nil
				}),
				ImportState:     true,
				ImportStateKind: resource.ImportBlockWithID,
				ImportPlanChecks: resource.ImportPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			{
				ResourceName:        name,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateVerifyIgnore: []string{
					"observability.traces.propagation_policy",
				},
			},
		},
	})
}

func TestAccZenthcloudWorker_SubdomainDynamicDefault(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := resourcePrefix + rnd
	name := "zenthcloud_worker." + resourceName
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				// Test that when subdomain.enabled = true, previews_enabled defaults to true
				Config: testAccZenthcloudWorkerConfigSubdomainEnabled(resourceName, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("subdomain"), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"enabled":          knownvalue.Bool(true),
						"previews_enabled": knownvalue.Bool(true),
					})),
				},
			},
			{
				// Test that explicit previews_enabled = false is respected
				Config: testAccZenthcloudWorkerConfigSubdomainExplicitPreviews(resourceName, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("subdomain"), knownvalue.ObjectPartial(map[string]knownvalue.Check{
						"enabled":          knownvalue.Bool(true),
						"previews_enabled": knownvalue.Bool(false),
					})),
				},
			},
		},
	})
}

// TestAccZenthcloudWorker_ObservabilityDestinations is a regression test for
// https://github.com/skygenesisenterprise/zenthcloud
// When an observability block is present but `destinations` is omitted, the
// plan must default to an empty list (not null) so it matches the API response.
// Without the fix, apply fails with "Provider produced inconsistent result
// after apply" because the planned value (null) differs from the API return ([]).
func TestAccZenthcloudWorker_ObservabilityDestinations(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	resourceName := resourcePrefix + rnd
	name := "zenthcloud_worker." + resourceName
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkerObservabilityLogs(resourceName, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					// destinations must be an empty list, not null
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("logs").AtMapKey("destinations"),
						knownvalue.ListExact([]knownvalue.Check{})),
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("traces").AtMapKey("destinations"),
						knownvalue.ListExact([]knownvalue.Check{})),
				},
			},
			{
				ResourceName:        name,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateVerifyIgnore: []string{
					"observability.traces.propagation_policy",
				},
			},
		},
	})
}

// TestAccZenthcloudWorker_ObservabilityTracesDisabled is a regression test for
// https://github.com/skygenesisenterprise/zenthcloud
// When a user sets observability.traces.enabled = false without explicitly
// configuring propagation_policy, the provider must NOT send propagation_policy
// in the request body. The API returns 403 ("propagation_policy requires the
// trace propagation feature to be enabled") when it receives the field on
// accounts that lack the feature.
func TestAccZenthcloudWorker_ObservabilityTracesDisabled(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	resourceName := resourcePrefix + rnd
	name := "zenthcloud_worker." + resourceName
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkerObservabilityTracesDisabled(resourceName, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("enabled"),
						knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("traces").AtMapKey("enabled"),
						knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("traces").AtMapKey("destinations"),
						knownvalue.ListExact([]knownvalue.Check{})),
				},
			},
			{
				Config: testAccZenthcloudWorkerObservabilityTracesDisabled(resourceName, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			{
				ResourceName:        name,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateVerifyIgnore: []string{
					"observability.traces.propagation_policy",
				},
			},
		},
	})
}

// TestAccZenthcloudWorker_ObservabilityDisabledWithLogs is a regression test
// for the compound bug described in
// https://github.com/skygenesisenterprise/zenthcloud
// Creating a worker with observability.enabled=false and an explicit logs block
// (but no destinations) must succeed without the propagation_policy 403 or the
// destinations null-vs-empty-list inconsistency.
func TestAccZenthcloudWorker_ObservabilityDisabledWithLogs(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	resourceName := resourcePrefix + rnd
	name := "zenthcloud_worker." + resourceName
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkerObservabilityDisabledWithLogs(resourceName, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("enabled"),
						knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("logs").AtMapKey("destinations"),
						knownvalue.ListExact([]knownvalue.Check{})),
					statecheck.ExpectKnownValue(name,
						tfjsonpath.New("observability").AtMapKey("traces").AtMapKey("destinations"),
						knownvalue.ListExact([]knownvalue.Check{})),
				},
			},
			{
				Config: testAccZenthcloudWorkerObservabilityDisabledWithLogs(resourceName, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

// Regression test for APIX-1801: changing only preview configuration must
// update the Worker and leave an empty plan after the API response is refreshed.
func TestAccZenthcloudWorker_PreviewsBaseConfigOnlyUpdate(t *testing.T) {
	t.Parallel()

	resourceName := resourcePrefix + utils.GenerateRandomResourceName()
	name := "zenthcloud_worker." + resourceName
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	cpuLimitPath := tfjsonpath.New("previews_base_config").AtMapKey("limits").AtMapKey("cpu_ms")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkerPreviewsBaseConfig(resourceName, accountID, 100),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, cpuLimitPath, knownvalue.Int64Exact(100)),
				},
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			{
				// Only previews_base_config.limits.cpu_ms differs from the first step.
				Config: testAccZenthcloudWorkerPreviewsBaseConfig(resourceName, accountID, 200),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, cpuLimitPath, knownvalue.Int64Exact(200)),
				},
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func testAccZenthcloudWorkerPreviewsBaseConfig(rnd, accountID string, cpuMs int) string {
	return acctest.LoadTestCase("previews_base_config.tf", rnd, accountID, cpuMs)
}

func testAccZenthcloudWorkerObservabilityLogs(rnd, accountID string) string {
	return acctest.LoadTestCase("observability_logs.tf", rnd, accountID)
}

func testAccZenthcloudWorkerObservabilityTracesDisabled(rnd, accountID string) string {
	return acctest.LoadTestCase("observability_traces_disabled.tf", rnd, accountID)
}

func testAccZenthcloudWorkerObservabilityDisabledWithLogs(rnd, accountID string) string {
	return acctest.LoadTestCase("observability_disabled_with_logs.tf", rnd, accountID)
}

func testAccZenthcloudWorkerConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("basic.tf", rnd, accountID)
}

func testAccZenthcloudWorkerConfigUpdate(rnd, accountID string) string {
	return acctest.LoadTestCase("basic_update.tf", rnd, accountID)
}

func testAccZenthcloudWorkerConfigSubdomainEnabled(rnd, accountID string) string {
	return acctest.LoadTestCase("subdomain_enabled.tf", rnd, accountID)
}

func testAccZenthcloudWorkerConfigSubdomainExplicitPreviews(rnd, accountID string) string {
	return acctest.LoadTestCase("subdomain_explicit_previews.tf", rnd, accountID)
}
