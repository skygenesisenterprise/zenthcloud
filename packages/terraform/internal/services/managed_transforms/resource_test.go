package managed_transforms_test

import (
	"context"
	"fmt"
	"regexp"

	"os"
	"strconv"
	"testing"

	zenthcloud "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/managed_transforms"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/option"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
	"github.com/pkg/errors"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_managed_headers", &resource.Sweeper{
		Name: "zenthcloud_managed_headers",
		F:    testSweepZenthcloudManagedTransforms,
	})
}

func testSweepZenthcloudManagedTransforms(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	if client == nil {
		tflog.Error(ctx, "Failed to create Zenthcloud client")
		return errors.New("failed to create client")
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		return errors.New("ZENTHCLOUD_ZONE_ID must be set")
	}

	tflog.Info(ctx, fmt.Sprintf("Deleting managed transforms (zone: %s)", zoneID))
	err := client.ManagedTransforms.Delete(
		ctx,
		managed_transforms.ManagedTransformDeleteParams{
			ZoneID: zenthcloud.F(zoneID),
		},
	)

	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to delete managed transforms: %s", err))
		return err
	}

	tflog.Info(ctx, "Deleted managed transforms")
	return nil
}

func cleanup(t *testing.T) {
	err := testSweepZenthcloudManagedTransforms("")

	if err != nil {
		t.Fatal("failed to cleanup resource for testing")
	}
}

func makeTransform(id string, enabled bool) map[string]string {
	return map[string]string{
		"id":      id,
		"enabled": strconv.FormatBool(enabled),
	}
}

func TestAccZenthcloudManagedHeaders(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransforms(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.1.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_visitor_location_headers", true),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsReorder(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.1.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_visitor_location_headers", true),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsRemovedHeader(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			{
				Config: testAccCheckZenthcloudManagedTransforms(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.1.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_visitor_location_headers", true),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsDisabledHeader(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.1.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_visitor_location_headers", false),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsEnabledReorderHeader(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.1.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_visitor_location_headers", true),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsDisabledReorderHeader(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.1.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_visitor_location_headers", false),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsRemovedHeader(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_request_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_request_headers.*",
						makeTransform("add_true_client_ip_headers", true),
					),

					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "managed_response_headers.0.%", "2"),
					resource.TestCheckTypeSetElemNestedAttrs(resourceName, "managed_response_headers.*",
						makeTransform("add_security_headers", true),
					),
				),
			},
			// See "Note about state import checks" comment in the end of the file for why we don't test that here.
		},
	})
}

func TestAccZenthcloudManagedHeaders_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsBasic(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_true_client_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(1).AtMapKey("id"), knownvalue.StringExact("add_visitor_location_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(1).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsRemovedHeader(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						// Verify the updated managed_request_headers (should have only 1 item now)
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("managed_request_headers"),
							knownvalue.ListExact([]knownvalue.Check{
								knownvalue.ObjectPartial(map[string]knownvalue.Check{
									"id":      knownvalue.StringExact("add_true_client_ip_headers"),
									"enabled": knownvalue.Bool(true),
								}),
							}),
						),
						// Verify managed_response_headers remains unchanged
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("managed_response_headers"),
							knownvalue.ListExact([]knownvalue.Check{
								knownvalue.ObjectPartial(map[string]knownvalue.Check{
									"id":      knownvalue.StringExact("add_security_headers"),
									"enabled": knownvalue.Bool(true),
								}),
							}),
						),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_true_client_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
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

func TestAccZenthcloudManagedHeaders_Disabled(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsDisabled(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_true_client_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(false)),
				},
			},
			// See "Note about state import checks" comment in the end of the file for why we don't test that here.
		},
	})
}

func TestAccZenthcloudManagedHeaders_RequestOnly(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsRequestOnly(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_true_client_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers"), knownvalue.ListSizeExact(0)),
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

func TestAccZenthcloudManagedHeaders_ResponseOnly(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsResponseOnly(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers"), knownvalue.ListSizeExact(0)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
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

func TestAccZenthcloudManagedHeaders_VisitorLocationHeaders(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsVisitorLocation(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_visitor_location_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers"), knownvalue.ListSizeExact(0)),
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

func TestAccZenthcloudManagedHeaders_LeakedCredentialsCheck(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsMixedRequestResponse(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_visitor_location_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
				},
			},
		},
	})
}

func TestAccZenthcloudManagedHeaders_RemoveVisitorIP(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsRemoveVisitorIP(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("remove_visitor_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers"), knownvalue.ListSizeExact(0)),
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

func TestAccZenthcloudManagedHeaders_ResponseHeaderDisabled(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsResponseHeaderDisabled(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers"), knownvalue.ListSizeExact(0)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(false)),
				},
			},
			// See "Note about state import checks" comment in the end of the file for why we don't test that here.
		},
	})
}

func TestAccZenthcloudManagedHeaders_MultipleRequestHeaders(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsMultipleRequest(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_visitor_location_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
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

func TestAccZenthcloudManagedHeaders_MixedEnabledDisabled(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsMixedState(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_true_client_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(1).AtMapKey("id"), knownvalue.StringExact("add_visitor_location_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(1).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
				},
			},
			// See "Note about state import checks" comment in the end of the file for why we don't test that here.
		},
	})
}

func TestAccZenthcloudManagedHeaders_UpdateTransforms(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsVisitorLocation(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_visitor_location_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers"), knownvalue.ListSizeExact(0)),
				},
			},
			{
				Config: testAccCheckZenthcloudManagedTransformsResponseHeaderDisabled(rnd, zoneID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						// Both managed_request_headers and managed_response_headers should change
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("managed_request_headers"),
							knownvalue.ListSizeExact(0),
						),
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("managed_response_headers"),
							knownvalue.ListExact([]knownvalue.Check{
								knownvalue.ObjectPartial(map[string]knownvalue.Check{
									"id":      knownvalue.StringExact("add_security_headers"),
									"enabled": knownvalue.Bool(false),
								}),
							}),
						),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers"), knownvalue.ListSizeExact(0)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_security_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(false)),
				},
			},
			// See "Note about state import checks" comment in the end of the file for why we don't test that here.
		},
	})
}

func TestAccZenthcloudManagedHeaders_ConflictDetection(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudManagedTransformsConflictTest(rnd, zoneID),
				ExpectError: regexp.MustCompile("404"),
			},
		},
	})
}

func TestAccZenthcloudManagedHeaders_ConflictingTransforms(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudManagedTransformsConflictingHeaders(rnd, zoneID),
				ExpectError: regexp.MustCompile("403|Forbidden|conflict"),
			},
		},
	})
}

func TestAccZenthcloudManagedHeaders_NonConflictingTransforms(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsNonConflictingHeaders(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_true_client_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(1).AtMapKey("id"), knownvalue.StringExact("add_visitor_location_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(1).AtMapKey("enabled"), knownvalue.Bool(true)),
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

// This test will only run if the environment has Enterprise plan access
func TestAccZenthcloudManagedHeaders_Enterprise(t *testing.T) {
	// Skip if not Enterprise environment
	//if os.Getenv("ZENTHCLOUD_ENTERPRISE_TEST") == "" {
	//	t.Skip("Skipping Enterprise test - set ZENTHCLOUD_ENTERPRISE_TEST=1 to run")
	//}

	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_managed_transforms." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudManagedTransformsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudManagedTransformsEnterprise(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact("add_true_client_ip_headers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_request_headers").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("managed_response_headers"), knownvalue.ListSizeExact(0)),
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

func testAccCheckZenthcloudManagedTransforms(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransforms.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsReorder(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsreorder.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsRemovedHeader(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsremovedheader.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsDisabledHeader(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsdisabledheader.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsEnabledReorderHeader(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsenabledreorderheader.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsDisabledReorderHeader(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsdisabledreorderheader.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsDisabled(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsdisabled.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsRequestOnly(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsrequestonly.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsResponseOnly(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsresponseonly.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsBasic(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransforms.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsVisitorLocation(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsvisitorlocation.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsMixedRequestResponse(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformstlsauth.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsRemoveVisitorIP(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsremovevisitorip.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsResponseHeaderDisabled(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsremovexpoweredby.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsMultipleRequest(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsmultiplerequest.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsMixedState(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsmixedstate.tf", rnd, zoneID)
}

// Test for potential conflicting transforms - this uses transforms that should be safe to use together
func testAccCheckZenthcloudManagedTransformsConflictTest(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsconflicttest.tf", rnd, zoneID)
}

// Test data for Enterprise-only transforms
func testAccCheckZenthcloudManagedTransformsEnterprise(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsenterprise.tf", rnd, zoneID)
}

// Test data for conflicting headers
func testAccCheckZenthcloudManagedTransformsConflictingHeaders(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsconflictingheaders.tf", rnd, zoneID)
}

func testAccCheckZenthcloudManagedTransformsNonConflictingHeaders(rnd, zoneID string) string {
	return acctest.LoadTestCase("managedtransformsnonconflictingheaders.tf", rnd, zoneID)
}

// Destroy verification function
func testAccCheckZenthcloudManagedTransformsDestroy(s *terraform.State) error {

	client := zenthcloud.NewClient(
		option.WithAPIKey(os.Getenv("ZENTHCLOUD_API_KEY")),
		option.WithAPIEmail(os.Getenv("ZENTHCLOUD_EMAIL")),
	)

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_managed_transforms" {
			continue
		}

		zoneID := rs.Primary.Attributes[consts.ZoneIDSchemaKey]
		managedHeaders, err := client.ManagedTransforms.List(context.Background(), managed_transforms.ManagedTransformListParams{
			ZoneID: zenthcloud.String(zoneID),
		})
		if err != nil {
			return fmt.Errorf("error listing managed headers: %w", err)
		}

		// Check if any headers are still enabled
		for _, h := range managedHeaders.ManagedRequestHeaders {
			if h.Enabled {
				return fmt.Errorf("managed request header %s is still enabled", h.ID)
			}
		}
		for _, h := range managedHeaders.ManagedResponseHeaders {
			if h.Enabled {
				return fmt.Errorf("managed response header %s is still enabled", h.ID)
			}
		}
	}

	return nil
}

// Note about state import checks:
//
// We can't test the state import when there are disabled transformations: those won't exist in
// the new state (and there's no way to change that in `ImportState()` because it doesn't have access
// to the previous state), so terraform would see a state diff from an import.

func TestAccUpgradeManagedTransforms_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	config := testAccCheckZenthcloudManagedTransforms(rnd, zoneID)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			cleanup(t)
		},
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
