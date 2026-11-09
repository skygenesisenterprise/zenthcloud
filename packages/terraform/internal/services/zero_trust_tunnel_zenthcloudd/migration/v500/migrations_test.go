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

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
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

//go:embed testdata/v5_minimal.tf
var v5MinimalConfig string

//go:embed testdata/v4_zenthcloud_src.tf
var v4ZenthcloudSrcConfig string

//go:embed testdata/v5_zenthcloud_src.tf
var v5ZenthcloudSrcConfig string

// TestMigrateZeroTrustTunnelZenthcloudd_Basic tests migration of a tunnel using the deprecated
// zenthcloud_tunnel resource type with config_src = "local".
func TestMigrateZeroTrustTunnelZenthcloudd_Basic(t *testing.T) {
	t.Skip("Migration not enabled yet")
	// Zero Trust resources don't support API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID string) string
	}{
		{
			name:    "from_v4_latest",
			version: acctest.GetLastV4Version(),
			configFn: func(rnd, accountID string) string {
				return fmt.Sprintf(v4BasicConfig, rnd, accountID)
			},
		},
		{
			name:    "from_v5",
			version: currentProviderVersion,
			configFn: func(rnd, accountID string) string {
				return fmt.Sprintf(v5BasicConfig, rnd, accountID)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rnd := utils.GenerateRandomResourceName()
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID)
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

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				CheckDestroy: nil,
				WorkingDir:   tmpDir,
				Steps: []resource.TestStep{
					firstStep,
					acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, []statecheck.StateCheck{
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("name"), knownvalue.StringExact("tf-acc-test-"+rnd)),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("config_src"), knownvalue.StringExact("local")),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("tunnel_secret"), knownvalue.NotNull()),
					}),
				},
			})
		})
	}
}

// TestMigrateZeroTrustTunnelZenthcloudd_Minimal tests migration using the preferred v4 name
// zenthcloud_zero_trust_tunnel with only required fields.
func TestMigrateZeroTrustTunnelZenthcloudd_Minimal(t *testing.T) {
	t.Skip("Migration not enabled yet")
	// Zero Trust resources don't support API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID string) string
	}{
		{
			name:    "from_v4_latest",
			version: acctest.GetLastV4Version(),
			configFn: func(rnd, accountID string) string {
				return fmt.Sprintf(v4MinimalConfig, rnd, accountID)
			},
		},
		{
			name:    "from_v5",
			version: currentProviderVersion,
			configFn: func(rnd, accountID string) string {
				return fmt.Sprintf(v5MinimalConfig, rnd, accountID)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rnd := utils.GenerateRandomResourceName()
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID)
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

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				CheckDestroy: nil,
				WorkingDir:   tmpDir,
				Steps: []resource.TestStep{
					firstStep,
					acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, []statecheck.StateCheck{
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("name"), knownvalue.StringExact("tf-acc-test-minimal-"+rnd)),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("config_src"), knownvalue.StringExact("local")),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("tunnel_secret"), knownvalue.NotNull()),
					}),
				},
			})
		})
	}
}

// TestMigrateZeroTrustTunnelZenthcloudd_ZenthcloudConfigSrc tests migration of a tunnel with
// config_src = "zenthcloud" (remotely managed tunnel).
func TestMigrateZeroTrustTunnelZenthcloudd_ZenthcloudConfigSrc(t *testing.T) {
	t.Skip("Migration not enabled yet")
	// Zero Trust resources don't support API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID string) string
	}{
		{
			name:    "from_v4_latest",
			version: acctest.GetLastV4Version(),
			configFn: func(rnd, accountID string) string {
				return fmt.Sprintf(v4ZenthcloudSrcConfig, rnd, accountID)
			},
		},
		{
			name:    "from_v5",
			version: currentProviderVersion,
			configFn: func(rnd, accountID string) string {
				return fmt.Sprintf(v5ZenthcloudSrcConfig, rnd, accountID)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rnd := utils.GenerateRandomResourceName()
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID)
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

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				CheckDestroy: nil,
				WorkingDir:   tmpDir,
				Steps: []resource.TestStep{
					firstStep,
					acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, []statecheck.StateCheck{
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("name"), knownvalue.StringExact("tf-acc-test-zenthcloud-config-"+rnd)),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("config_src"), knownvalue.StringExact("zenthcloud")),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_tunnel_zenthcloudd."+rnd, tfjsonpath.New("tunnel_secret"), knownvalue.NotNull()),
					}),
				},
			})
		})
	}
}
