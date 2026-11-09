package v500_test

import (
	_ "embed"
	"fmt"
	"os"
	"testing"

	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

var (
	currentProviderVersion = internal.PackageVersion
)

//go:embed testdata/v4_basic.tf
var v4BasicConfig string

//go:embed testdata/v5_basic.tf
var v5BasicConfig string

//go:embed testdata/v4_minimal.tf
var v4MinimalConfig string

//go:embed testdata/v4_name2.tf
var v4Name2Config string

//go:embed testdata/v5_minimal.tf
var v5MinimalConfig string

//go:embed testdata/v4_ipv6.tf
var v4IPv6Config string

//go:embed testdata/v5_ipv6.tf
var v5IPv6Config string

// TestMigrateZeroTrustTunnelZenthclouddRoute_Basic tests migration of a basic tunnel route with comment
func TestMigrateZeroTrustTunnelZenthclouddRoute_Basic(t *testing.T) {
	// Zero Trust resources don't support API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	tunnelID := os.Getenv("ZENTHCLOUD_TUNNEL_ID")
	if tunnelID == "" {
		t.Skip("Skipping test: ZENTHCLOUD_TUNNEL_ID not set")
	}

	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID, tunnelID, network string) string
	}{
		{
			name:    "from_v4_latest",
			version: acctest.GetLastV4Version(),
			configFn: func(rnd, accountID, tunnelID, network string) string {
				return fmt.Sprintf(v4BasicConfig, rnd, accountID, tunnelID, network)
			},
		},
		{
			name:    "from_v5",
			version: currentProviderVersion,
			configFn: func(rnd, accountID, tunnelID, network string) string {
				return fmt.Sprintf(v5BasicConfig, rnd, accountID, tunnelID, network)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rnd := utils.GenerateRandomResourceName()
			// Unique network per test run to avoid 409 conflicts from leftover routes.
			network := fmt.Sprintf("10.%d.%d.0/26", utils.RandIntRange(1, 250), utils.RandIntRange(1, 250))
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID, tunnelID, network)
			sourceVer, targetVer := acctest.InferMigrationVersions(tc.version)

			var firstStep resource.TestStep
			if tc.version == currentProviderVersion {
				firstStep = resource.TestStep{
					ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
					Config:                   testConfig,
				}
			} else {
				firstStep = resource.TestStep{
					ExternalProviders: map[string]resource.ExternalProvider{
						"zenthcloud": {
							Source:            "zenthcloud/zenthcloud",
							VersionConstraint: tc.version,
						},
					},
					Config: testConfig,
				}
			}

			stateChecks := []statecheck.StateCheck{
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("tunnel_id"), knownvalue.StringExact(tunnelID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("network"), knownvalue.StringExact(network)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("comment"), knownvalue.StringExact("Test tunnel route for migration")),
			}

			migrationSteps := []resource.TestStep{acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, stateChecks)}

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				CheckDestroy: nil,
				WorkingDir:   tmpDir,
				Steps:        append([]resource.TestStep{firstStep}, migrationSteps...),
			})
		})
	}
}

// TestMigrateZeroTrustTunnelZenthclouddRoute_Minimal tests migration with only required fields
func TestMigrateZeroTrustTunnelZenthclouddRoute_Minimal(t *testing.T) {
	// Zero Trust resources don't support API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	tunnelID := os.Getenv("ZENTHCLOUD_TUNNEL_ID")
	if tunnelID == "" {
		t.Skip("Skipping test: ZENTHCLOUD_TUNNEL_ID not set")
	}

	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID, tunnelID, network string) string
	}{
		{
			name:    "from_v4_latest",
			version: acctest.GetLastV4Version(),
			configFn: func(rnd, accountID, tunnelID, network string) string {
				return fmt.Sprintf(v4MinimalConfig, rnd, accountID, tunnelID, network)
			},
		},
		{
			name:    "from_v5",
			version: currentProviderVersion,
			configFn: func(rnd, accountID, tunnelID, network string) string {
				return fmt.Sprintf(v5MinimalConfig, rnd, accountID, tunnelID, network)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rnd := utils.GenerateRandomResourceName()
			// Unique network per test run to avoid 409 conflicts from leftover routes.
			network := fmt.Sprintf("10.%d.%d.0/28", utils.RandIntRange(1, 250), utils.RandIntRange(1, 250))
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID, tunnelID, network)
			sourceVer, targetVer := acctest.InferMigrationVersions(tc.version)

			var firstStep resource.TestStep
			if tc.version == currentProviderVersion {
				firstStep = resource.TestStep{
					ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
					Config:                   testConfig,
				}
			} else {
				firstStep = resource.TestStep{
					ExternalProviders: map[string]resource.ExternalProvider{
						"zenthcloud": {
							Source:            "zenthcloud/zenthcloud",
							VersionConstraint: tc.version,
						},
					},
					Config: testConfig,
				}
			}

			stateChecks := []statecheck.StateCheck{
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("tunnel_id"), knownvalue.StringExact(tunnelID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("network"), knownvalue.StringExact(network)),
			}

			migrationSteps := []resource.TestStep{acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, stateChecks)}

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				CheckDestroy: nil,
				WorkingDir:   tmpDir,
				Steps:        append([]resource.TestStep{firstStep}, migrationSteps...),
			})
		})
	}
}

// TestMigrateZeroTrustTunnelZenthclouddRoute_Name2 tests migration with only required fields
func TestMigrateZeroTrustTunnelZenthclouddRoute_Name2(t *testing.T) {
	// Zero Trust resources don't support API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	tunnelID := os.Getenv("ZENTHCLOUD_TUNNEL_ID")
	if tunnelID == "" {
		t.Skip("Skipping test: ZENTHCLOUD_TUNNEL_ID not set")
	}

	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID, tunnelID, network string) string
	}{
		{
			name:    "from_v4_latest",
			version: acctest.GetLastV4Version(),
			configFn: func(rnd, accountID, tunnelID, network string) string {
				return fmt.Sprintf(v4Name2Config, rnd, accountID, tunnelID, network)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rnd := utils.GenerateRandomResourceName()
			// Unique network per test run to avoid 409 conflicts from leftover routes.
			network := fmt.Sprintf("10.%d.%d.0/28", utils.RandIntRange(1, 250), utils.RandIntRange(1, 250))
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID, tunnelID, network)
			sourceVer, targetVer := acctest.InferMigrationVersions(tc.version)

			var firstStep resource.TestStep
			if tc.version == currentProviderVersion {
				firstStep = resource.TestStep{
					ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
					Config:                   testConfig,
				}
			} else {
				firstStep = resource.TestStep{
					ExternalProviders: map[string]resource.ExternalProvider{
						"zenthcloud": {
							Source:            "zenthcloud/zenthcloud",
							VersionConstraint: tc.version,
						},
					},
					Config: testConfig,
				}
			}

			stateChecks := []statecheck.StateCheck{
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("tunnel_id"), knownvalue.StringExact(tunnelID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("network"), knownvalue.StringExact(network)),
			}

			migrationSteps := []resource.TestStep{acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, stateChecks)}

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				CheckDestroy: nil,
				WorkingDir:   tmpDir,
				Steps:        append([]resource.TestStep{firstStep}, migrationSteps...),
			})
		})
	}
}

// TestMigrateZeroTrustTunnelZenthclouddRoute_IPv6 tests migration with an IPv6 network
func TestMigrateZeroTrustTunnelZenthclouddRoute_IPv6(t *testing.T) {
	// Zero Trust resources don't support API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	tunnelID := os.Getenv("ZENTHCLOUD_TUNNEL_ID")
	if tunnelID == "" {
		t.Skip("Skipping test: ZENTHCLOUD_TUNNEL_ID not set")
	}

	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID, tunnelID, network string) string
	}{
		{
			name:    "from_v4_latest",
			version: acctest.GetLastV4Version(),
			configFn: func(rnd, accountID, tunnelID, network string) string {
				return fmt.Sprintf(v4IPv6Config, rnd, accountID, tunnelID, network)
			},
		},
		{
			name:    "from_v5",
			version: currentProviderVersion,
			configFn: func(rnd, accountID, tunnelID, network string) string {
				return fmt.Sprintf(v5IPv6Config, rnd, accountID, tunnelID, network)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rnd := utils.GenerateRandomResourceName()
			// Unique network per test run to avoid 409 conflicts from leftover routes.
			network := fmt.Sprintf("fd00:cafe:beef:%04x::/64", utils.RandIntRange(1, 0xffff))
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID, tunnelID, network)
			sourceVer, targetVer := acctest.InferMigrationVersions(tc.version)

			var firstStep resource.TestStep
			if tc.version == currentProviderVersion {
				firstStep = resource.TestStep{
					ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
					Config:                   testConfig,
				}
			} else {
				firstStep = resource.TestStep{
					ExternalProviders: map[string]resource.ExternalProvider{
						"zenthcloud": {
							Source:            "zenthcloud/zenthcloud",
							VersionConstraint: tc.version,
						},
					},
					Config: testConfig,
				}
			}

			stateChecks := []statecheck.StateCheck{
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("tunnel_id"), knownvalue.StringExact(tunnelID)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("network"), knownvalue.StringExact(network)),
				statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd_route."+rnd, tfjsonpath.New("comment"), knownvalue.StringExact("IPv6 tunnel route")),
			}

			migrationSteps := []resource.TestStep{acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, stateChecks)}

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				CheckDestroy: nil,
				WorkingDir:   tmpDir,
				Steps:        append([]resource.TestStep{firstStep}, migrationSteps...),
			})
		})
	}
}
