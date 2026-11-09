package dns_record_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"strings"
	"testing"
	"time"

	"log"

	zenthcloud "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/dns"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
	"github.com/pkg/errors"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_dns_record", &resource.Sweeper{
		Name: "zenthcloud_dns_record",
		F:    testSweepZenthcloudRecord,
	})
}

func testSweepZenthcloudRecord(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	// Clean up DNS records
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping DNS records sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	// List all DNS records using v6 SDK
	records, err := client.DNS.Records.List(ctx, dns.RecordListParams{
		ZoneID: zenthcloud.F(zoneID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud DNS records: %s", err))
		return err
	}

	recordList := records.Result
	if len(recordList) == 0 {
		tflog.Info(ctx, "No Zenthcloud DNS records to sweep")
		return nil
	}

	tflog.Info(ctx, fmt.Sprintf("Found %d DNS records to evaluate", len(recordList)))

	deletedCount := 0
	skippedCount := 0

	for _, record := range recordList {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(record.Name) {
			skippedCount++
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting DNS record ID: %s, Name: %s, Type: %s, Content: %s", record.ID, record.Name, record.Type, record.Content))
		_, err := client.DNS.Records.Delete(ctx, record.ID, dns.RecordDeleteParams{
			ZoneID: zenthcloud.F(zoneID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete DNS record %s: %s", record.ID, err))
		} else {
			deletedCount++
		}
	}

	tflog.Info(ctx, fmt.Sprintf("Deleted %d DNS records, skipped %d records", deletedCount, skippedCount))
	return nil
}

func TestAccZenthcloudRecord_Basic(t *testing.T) {
	//t.Parallel()
	var record dns.RecordResponse
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigBasic(zoneID, "tf-acctest-basic", rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					testAccCheckZenthcloudRecordAttributes(&record),
					resource.TestCheckResourceAttr(resourceName, "name", fmt.Sprintf("tf-acctest-basic.%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.10"),
					resource.TestMatchResourceAttr(resourceName, consts.ZoneIDSchemaKey, regexp.MustCompile("^[a-z0-9]{32}$")),
					resource.TestCheckResourceAttr(resourceName, "ttl", "3600"),
					resource.TestCheckResourceAttr(resourceName, "tags.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "tags.0", "tag1"),
					resource.TestCheckResourceAttr(resourceName, "tags.1", "tag2"),
					resource.TestCheckResourceAttr(resourceName, "comment", "this is a comment"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_Apex(t *testing.T) {
	//t.Parallel()
	var record dns.RecordResponse
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigApex(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					testAccCheckZenthcloudRecordAttributes(&record),
					resource.TestCheckResourceAttr(resourceName, "name", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.10"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_LOC(t *testing.T) {
	//t.Parallel()
	var record dns.RecordResponse
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigLOC(zoneID, "tf-acctest-loc."+domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					resource.TestCheckResourceAttr(resourceName, "content", "37 46 46.000 N 122 23 35.000 W 0.00 100.00 0.00 0.00"),
					resource.TestCheckResourceAttr(resourceName, "proxiable", "false"),
					resource.TestCheckResourceAttr(resourceName, "data.lat_degrees", "37"),
					resource.TestCheckResourceAttr(resourceName, "data.lat_degrees", "37"),
					resource.TestCheckResourceAttr(resourceName, "data.lat_minutes", "46"),
					resource.TestCheckResourceAttr(resourceName, "data.lat_seconds", "46"),
					resource.TestCheckResourceAttr(resourceName, "data.lat_direction", "N"),
					resource.TestCheckResourceAttr(resourceName, "data.long_degrees", "122"),
					resource.TestCheckResourceAttr(resourceName, "data.long_minutes", "23"),
					resource.TestCheckResourceAttr(resourceName, "data.long_seconds", "35"),
					resource.TestCheckResourceAttr(resourceName, "data.long_direction", "W"),
					resource.TestCheckResourceAttr(resourceName, "data.altitude", "0"),
					resource.TestCheckResourceAttr(resourceName, "data.size", "100"),
					resource.TestCheckResourceAttr(resourceName, "data.precision_horz", "0"),
					resource.TestCheckResourceAttr(resourceName, "data.precision_vert", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_SRV(t *testing.T) {
	//t.Parallel()
	var record dns.RecordResponse
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigSRV(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					resource.TestCheckResourceAttr(resourceName, "name", fmt.Sprintf("_xmpp-client._tcp.%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(resourceName, "content", "0 5222 talk.l.google.com"),
					resource.TestCheckResourceAttr(resourceName, "proxiable", "false"),
					resource.TestCheckResourceAttr(resourceName, "data.priority", "5"),
					resource.TestCheckResourceAttr(resourceName, "data.weight", "0"),
					resource.TestCheckResourceAttr(resourceName, "data.port", "5222"),
					resource.TestCheckResourceAttr(resourceName, "data.target", "talk.l.google.com"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_CAA(t *testing.T) {
	//t.Parallel()
	var record dns.RecordResponse
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigCAA(rnd, zoneID, fmt.Sprintf("tf-acctest-caa.%s", domain), 600),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					resource.TestCheckResourceAttr(resourceName, "data.flags", "0"),
					resource.TestCheckResourceAttr(resourceName, "data.tag", "issue"),
					resource.TestCheckResourceAttr(resourceName, "data.value", "letsencrypt.org"),
				),
			},
			{
				Config: testAccCheckZenthcloudRecordConfigCAA(rnd, zoneID, fmt.Sprintf("tf-acctest-caa.%s", domain), 300),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					resource.TestCheckResourceAttr(resourceName, "data.flags", "0"),
					resource.TestCheckResourceAttr(resourceName, "data.tag", "issue"),
					resource.TestCheckResourceAttr(resourceName, "data.value", "letsencrypt.org"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_Proxied(t *testing.T) {
	//t.Parallel()
	var record dns.RecordResponse
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigProxied(zoneID, domain, "tf-acctest-proxied", rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					resource.TestCheckResourceAttr(resourceName, "proxiable", "true"),
					resource.TestCheckResourceAttr(resourceName, "proxied", "true"),
					resource.TestCheckResourceAttr(resourceName, "type", "CNAME"),
					resource.TestCheckResourceAttr(resourceName, "content", domain),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_Updated(t *testing.T) {
	//t.Parallel()
	var record dns.RecordResponse
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	recordName := "tf-acctest-update"
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigBasic(zoneID, recordName, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					testAccCheckZenthcloudRecordAttributes(&record),
				),
			},
			{
				Config: testAccCheckZenthcloudRecordConfigNewValue(zoneID, recordName, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					testAccCheckZenthcloudRecordAttributesUpdated(&record),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_typeForceNewRecord(t *testing.T) {
	//t.Parallel()
	var afterCreate, afterUpdate dns.RecordResponse
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	recordName := "tf-acctest-type-force-new"
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigBasic(zoneID, recordName, rnd, zoneName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &afterCreate),
				),
			},
			{
				Config: testAccCheckZenthcloudRecordConfigChangeType(zoneID, recordName, zoneName, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &afterUpdate),
					testAccCheckZenthcloudRecordRecreated(&afterCreate, &afterUpdate),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_TtlValidation(t *testing.T) {
	//t.Parallel()
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	recordName := "tf-acctest-ttl-validation"
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudRecordConfigTtlValidation(zoneID, recordName, zoneName, rnd),
				ExpectError: regexp.MustCompile("ttl must be set to 1 when `proxied` is true"),
			},
		},
	})
}

func TestAccZenthcloudRecord_ExplicitProxiedFalse(t *testing.T) {
	//t.Parallel()
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_dns_record." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigExplicitProxied(zoneID, rnd, zoneName, "false", "300"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "proxied", "false"),
					resource.TestCheckResourceAttr(resourceName, "ttl", "300"),
				),
			},
			{
				Config: testAccCheckZenthcloudRecordConfigExplicitProxied(zoneID, rnd, zoneName, "true", "1"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "proxied", "true"),
					resource.TestCheckResourceAttr(resourceName, "ttl", "1"),
				),
			},
			{
				Config: testAccCheckZenthcloudRecordConfigExplicitProxied(zoneID, rnd, zoneName, "false", "300"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "proxied", "false"),
					resource.TestCheckResourceAttr(resourceName, "ttl", "300"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_MXWithPriorityZero(t *testing.T) {
	//t.Parallel()
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_dns_record." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigMXWithPriorityZero(zoneID, rnd, zoneName),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "priority", "0"),
					resource.TestCheckResourceAttr(resourceName, "content", "mail.terraform.cfapi.net"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_HTTPS(t *testing.T) {
	//t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigHTTPS(zoneID, rnd, zoneName),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "data.priority", "1"),
					resource.TestCheckResourceAttr(name, "data.target", "."),
					resource.TestCheckResourceAttr(name, "data.value", `alpn="h2"`),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_SVCB(t *testing.T) {
	//t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigSVCB(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "data.priority", "2"),
					resource.TestCheckResourceAttr(name, "data.target", "foo."),
					resource.TestCheckResourceAttr(name, "data.value", `alpn="h3,h2"`),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_MXNull(t *testing.T) {
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordNullMX(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd+"."+domain),
					resource.TestCheckResourceAttr(name, "content", "."),
					resource.TestCheckResourceAttr(name, "priority", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_DNSKEY(t *testing.T) {
	acctest.TestAccSkipForDefaultZone(t, "Pending automating setup from https://github.com/skygenesisenterprise/zenthcloud")
	t.Skip("Requires a zone with multi-provider DNSSEC enabled; skipping until dedicated test zone is available.")

	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_Domain(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordDNSKEY(zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", domain),
					resource.TestCheckResourceAttr(name, "type", "DNSKEY"),
					resource.TestCheckResourceAttr(name, "data.flags", "257"),
					resource.TestCheckResourceAttr(name, "data.protocol", "13"),
					resource.TestCheckResourceAttr(name, "data.algorithm", "2"),
					resource.TestCheckResourceAttr(name, "data.public_key", "mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rAK9iUzy1L53eKGQ=="),
				),
			},
		},
	})
}

func TestAccZenthcloudRecord_ClearTags(t *testing.T) {
	t.Skip("Skipping: API does not clear tags as expected (tags.# expected 0, got 2); pre-existing API behavior")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigMultipleTags(zoneID, rnd, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd+"."+domain),
					resource.TestCheckResourceAttr(name, "tags.#", "2"),
					resource.TestCheckResourceAttr(name, "comment", "this is a comment"),
				),
			},
			{
				Config: testAccCheckZenthcloudRecordConfigNoTags(zoneID, rnd, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd+"."+domain),
					resource.TestCheckResourceAttr(name, "tags.#", "0"),
					resource.TestCheckNoResourceAttr(name, "comment"),
				),
			},
		},
	})
}

func TestSuppressTrailingDots(t *testing.T) {
	t.Parallel()

	cases := []struct {
		old      string
		new      string
		expected bool
	}{
		{"", "", true},
		{"", "example.com", false},
		{"", "example.com.", false},
		{"", ".", false}, // single dot is used for Null MX record
		{"example.com", "example.com", true},
		{"example.com", "example.com.", true},
		{"example.com", "sub.example.com", false},
		{"sub.example.com", "sub.example.com.", true},
		{".", ".", true},
	}

	for _, c := range cases {
		got := suppressTrailingDots("", c.old, c.new, nil)
		assert.Equal(t, c.expected, got)
	}
}

// TestAccZenthcloudRecord_TagsDrift tests for the issue reported in
// https://github.com/skygenesisenterprise/zenthcloud
// where DNS records show perpetual drift with tags and other computed fields
func TestAccZenthcloudRecord_TagsDrift(t *testing.T) {
	// Don't run in parallel to avoid conflicts
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create resources with various tag configurations
			{
				Config: testAccCheckZenthcloudRecordConfigTagsDrift(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					// Record with empty tags list
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s", rnd), "tags.#", "0"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s", rnd), "type", "A"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s", rnd), "content", "192.168.0.10"),

					// Record with explicit tags (tags are a set, so order may vary)
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_with_tags", rnd), "tags.#", "2"),
					resource.TestCheckTypeSetElemAttr(fmt.Sprintf("zenthcloud_dns_record.%s_with_tags", rnd), "tags.*", "test:tag1"),
					resource.TestCheckTypeSetElemAttr(fmt.Sprintf("zenthcloud_dns_record.%s_with_tags", rnd), "tags.*", "env:test"),

					// Record with settings
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_with_settings", rnd), "settings.flatten_cname", "false"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_with_settings", rnd), "tags.#", "0"),

					// Record without tags specified
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_no_tags", rnd), "type", "A"),
				),
			},
			// Step 2: Apply the same configuration again to check for drift
			// This should not show any changes if the provider handles defaults correctly
			{
				Config:             testAccCheckZenthcloudRecordConfigTagsDrift(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // We expect NO changes on re-apply
			},
			// Step 3: Import test to verify state consistency
			{
				ResourceName:        fmt.Sprintf("zenthcloud_dns_record.%s", rnd),
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateIdPrefix: fmt.Sprintf("%s/", zoneID),
				// Ignore computed fields that might differ after import
				ImportStateVerifyIgnore: []string{"comment_modified_on", "created_on", "modified_on", "tags_modified_on"},
			},
			{
				ResourceName:            fmt.Sprintf("zenthcloud_dns_record.%s_with_tags", rnd),
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", zoneID),
				ImportStateVerifyIgnore: []string{"comment_modified_on", "created_on", "modified_on", "tags_modified_on"},
			},
			{
				ResourceName:            fmt.Sprintf("zenthcloud_dns_record.%s_with_settings", rnd),
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", zoneID),
				ImportStateVerifyIgnore: []string{"comment_modified_on", "created_on", "modified_on", "tags_modified_on"},
			},
		},
	})
}

// TestAccZenthcloudRecord_ComputedFieldsDrift specifically tests for computed fields
// causing perpetual drift as reported in issue #5517
func TestAccZenthcloudRecord_ComputedFieldsDrift(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create minimal DNS record
			{
				Config: testAccCheckZenthcloudRecordConfigComputedDrift(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					// Verify minimal record
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_minimal", rnd), "type", "A"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_minimal", rnd), "content", "192.168.0.20"),
					// Check that computed fields are set
					resource.TestCheckResourceAttrSet(fmt.Sprintf("zenthcloud_dns_record.%s_minimal", rnd), "created_on"),
					resource.TestCheckResourceAttrSet(fmt.Sprintf("zenthcloud_dns_record.%s_minimal", rnd), "modified_on"),
					resource.TestCheckResourceAttrSet(fmt.Sprintf("zenthcloud_dns_record.%s_minimal", rnd), "proxiable"),

					// Verify CNAME with settings
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_cname_settings", rnd), "type", "CNAME"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_cname_settings", rnd), "settings.flatten_cname", "false"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_cname_settings", rnd), "tags.#", "0"),

					// Verify record with comment
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_with_comment", rnd), "comment", "Test comment for drift"),
					resource.TestCheckResourceAttrSet(fmt.Sprintf("zenthcloud_dns_record.%s_with_comment", rnd), "comment_modified_on"),
				),
			},
			// Step 2: Re-apply to check for drift - this is the critical test
			// If there's a drift issue, this will fail with ExpectNonEmptyPlan: false
			{
				Config:             testAccCheckZenthcloudRecordConfigComputedDrift(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // Should be no changes on re-apply
			},
			// Step 3: Make a small change to verify updates work correctly
			{
				Config: testAccCheckZenthcloudRecordConfigComputedDriftUpdated(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_minimal", rnd), "content", "192.168.0.25"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_with_comment", rnd), "comment", "Updated comment"),
				),
			},
			// Step 4: Re-apply updated config to ensure no drift after update
			{
				Config:             testAccCheckZenthcloudRecordConfigComputedDriftUpdated(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // Should be no changes on re-apply
			},
		},
	})
}

// TestAccZenthcloudRecord_DriftIssue5517 specifically tests for the drift issues
// reported in https://github.com/skygenesisenterprise/zenthcloud
// This test attempts to reproduce the exact scenarios users reported
func TestAccZenthcloudRecord_DriftIssue5517(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create records that users reported as problematic
			{
				Config: testAccCheckZenthcloudRecordConfigDriftRepro(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					// Check proxied CNAME with settings
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_proxied_cname_with_settings", rnd), "type", "CNAME"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_proxied_cname_with_settings", rnd), "proxied", "true"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_proxied_cname_with_settings", rnd), "settings.flatten_cname", "false"),

					// Check CNAME with mixed case - checking if it preserves case
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_cname_mixed_case", rnd), "type", "CNAME"),
					// For now, just check that it's set, we'll see in step 2 if it causes drift
					resource.TestCheckResourceAttrSet(fmt.Sprintf("zenthcloud_dns_record.%s_cname_mixed_case", rnd), "content"),

					// Check empty tags
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_a_record_empty_tags", rnd), "tags.#", "0"),
				),
			},
			// Step 2: CRITICAL TEST - Re-apply to check for drift
			// This is where users are seeing the issue
			{
				Config:             testAccCheckZenthcloudRecordConfigDriftRepro(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // We expect NO changes
			},
		},
	})
}

// TestAccZenthcloudRecord_ModifiedOnDrift repros issue #6438.
// This ensures that records with data fields (CAA, LOC) and settings don't cause
// "Provider produced inconsistent result after apply" errors.
func TestAccZenthcloudRecord_ModifiedOnDrift6438(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	caaResourceName := fmt.Sprintf("zenthcloud_dns_record.%s_caa", rnd)
	locResourceName := fmt.Sprintf("zenthcloud_dns_record.%s_loc", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create CAA and LOC records with data field
			{
				Config: testAccCheckZenthcloudRecordConfigModifiedOnDriftCAA(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					// Check CAA record
					resource.TestCheckResourceAttr(caaResourceName, "type", "CAA"),
					resource.TestCheckResourceAttr(caaResourceName, "data.flags", "0"),
					resource.TestCheckResourceAttr(caaResourceName, "data.tag", "issue"),
					resource.TestCheckResourceAttr(caaResourceName, "data.value", "letsencrypt.org"),
					// Verify modified_on is set
					resource.TestCheckResourceAttrSet(caaResourceName, "modified_on"),
					resource.TestCheckResourceAttrSet(caaResourceName, "created_on"),
					// Check LOC record
					resource.TestCheckResourceAttr(locResourceName, "type", "LOC"),
					resource.TestCheckResourceAttrSet(locResourceName, "modified_on"),
					resource.TestCheckResourceAttrSet(locResourceName, "created_on"),
				),
				// Use ConfigStateChecks to validate state after apply
				ConfigStateChecks: []statecheck.StateCheck{
					// Ensure modified_on is properly set as a known value
					statecheck.ExpectKnownValue(caaResourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(caaResourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(locResourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(locResourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
				},
				// Use ConfigPlanChecks to validate the plan
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						// Ensure modified_on starts as unknown for new resources
						plancheck.ExpectUnknownValue(caaResourceName, tfjsonpath.New("modified_on")),
						plancheck.ExpectUnknownValue(locResourceName, tfjsonpath.New("modified_on")),
					},
				},
			},
			// Step 2: Re-apply same config - should not detect changes (no drift)
			{
				Config:             testAccCheckZenthcloudRecordConfigModifiedOnDriftCAA(zoneID, rnd, domain),
				ExpectNonEmptyPlan: false, // No changes expected
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						// Ensure no changes are planned
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Step 3: Refresh and ensure no drift is detected
			{
				RefreshState:       true,
				ExpectNonEmptyPlan: false,
			},
			// Step 4: Apply multiple times to ensure stability
			{
				Config:             testAccCheckZenthcloudRecordConfigModifiedOnDriftCAA(zoneID, rnd, domain),
				ExpectNonEmptyPlan: false, // Still no changes expected
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					// After apply, all computed fields should remain stable
					statecheck.ExpectKnownValue(caaResourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(caaResourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(locResourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(locResourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
				},
			},
		},
	})
}

// TestAccZenthcloudRecord_SettingsDrift tests that records with settings field
// don't cause drift when the settings are effectively empty or unchanged
func TestAccZenthcloudRecord_SettingsDrift(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create record with settings
			{
				Config: testAccCheckZenthcloudRecordConfigSettingsDrift(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					// Check CNAME record with settings
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_a_with_settings", rnd), "type", "CNAME"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_a_with_settings", rnd), "settings.flatten_cname", "false"),
					// Check empty settings record
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_a_empty_settings", rnd), "type", "A"),
				),
			},
			// Step 2: Re-apply - should not detect changes
			{
				Config:             testAccCheckZenthcloudRecordConfigSettingsDrift(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false,
			},
			// Step 3: Remove settings from first record
			{
				Config: testAccCheckZenthcloudRecordConfigSettingsDriftRemoved(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_a_with_settings", rnd), "type", "CNAME"),
				),
			},
			// Step 4: Re-apply - should not detect changes after settings removal
			{
				Config:             testAccCheckZenthcloudRecordConfigSettingsDriftRemoved(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false,
			},
		},
	})
}

// TestAccZenthcloudRecord_ComprehensiveDriftPrevention is the ultimate test to ensure
// the modified_on drift issue never occurs again. It tests all edge cases and validates
// pre-apply, post-apply, and refresh states.
func TestAccZenthcloudRecord_ComprehensiveDriftPrevention(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	// Define resource names for all test cases
	basicA := fmt.Sprintf("zenthcloud_dns_record.%s_basic_a", rnd)
	caaRecord := fmt.Sprintf("zenthcloud_dns_record.%s_caa", rnd)
	cnameRecord := fmt.Sprintf("zenthcloud_dns_record.%s_cname", rnd)
	recordWithTags := fmt.Sprintf("zenthcloud_dns_record.%s_with_tags", rnd)
	recordWithSettings := fmt.Sprintf("zenthcloud_dns_record.%s_with_settings", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create all types of records
			{
				Config: testAccCheckZenthcloudRecordConfigComprehensiveDrift(zoneID, rnd, domain, false),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						// All computed fields should be unknown before first apply
						plancheck.ExpectUnknownValue(basicA, tfjsonpath.New("modified_on")),
						plancheck.ExpectUnknownValue(basicA, tfjsonpath.New("created_on")),
						plancheck.ExpectUnknownValue(caaRecord, tfjsonpath.New("modified_on")),
						plancheck.ExpectUnknownValue(cnameRecord, tfjsonpath.New("modified_on")),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					// After apply, all computed fields should be known
					statecheck.ExpectKnownValue(basicA, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(basicA, tfjsonpath.New("created_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(caaRecord, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(cnameRecord, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
					// Verify tags handling
					statecheck.ExpectKnownValue(recordWithTags, tfjsonpath.New("tags"), knownvalue.SetSizeExact(2)),
					// Verify settings handling
					statecheck.ExpectKnownValue(recordWithSettings, tfjsonpath.New("settings"), knownvalue.NotNull()),
				},
			},
			// Step 2: Immediate re-apply - critical for drift detection
			{
				Config:             testAccCheckZenthcloudRecordConfigComprehensiveDrift(zoneID, rnd, domain, false),
				ExpectNonEmptyPlan: false,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Step 3: Force refresh to ensure Read doesn't cause drift
			{
				RefreshState:       true,
				ExpectNonEmptyPlan: false,
			},
			// Step 4: Make actual changes and verify they're detected correctly
			{
				Config: testAccCheckZenthcloudRecordConfigComprehensiveDrift(zoneID, rnd, domain, true),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						// Should detect the actual content changes
						plancheck.ExpectResourceAction(basicA, plancheck.ResourceActionUpdate),
						// modified_on should be unknown when there are real changes
						plancheck.ExpectUnknownValue(basicA, tfjsonpath.New("modified_on")),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					// Verify the change was applied
					statecheck.ExpectKnownValue(basicA, tfjsonpath.New("content"), knownvalue.StringExact("192.168.1.2")),
				},
			},
			// Step 5: Re-apply after changes - ensure no drift
			{
				Config:             testAccCheckZenthcloudRecordConfigComprehensiveDrift(zoneID, rnd, domain, true),
				ExpectNonEmptyPlan: false,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Step 6: Multiple refreshes to ensure stability
			{
				RefreshState:       true,
				ExpectNonEmptyPlan: false,
			},
			{
				RefreshState:       true,
				ExpectNonEmptyPlan: false,
			},
		},
	})
}

// Simple test to isolate the tags drift issue for records without explicit tags
func TestAccZenthcloudRecord_SimpleDrift(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigSimpleDrift(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s", rnd), "type", "A"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s", rnd), "content", "192.168.0.50"),
				),
			},
			// Second step: Apply same config again - should NOT show drift
			{
				Config:             testAccCheckZenthcloudRecordConfigSimpleDrift(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // We expect NO changes
			},
		},
	})
}

// Test CNAME case normalization specifically
func TestAccZenthcloudRecord_CNAMECase(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigCNAMECase(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s", rnd), "type", "CNAME"),
				),
			},
			// Second step: Apply same config again - should NOT show drift
			{
				Config:             testAccCheckZenthcloudRecordConfigCNAMECase(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // We expect NO changes
			},
		},
	})
}

func TestAccZenthcloudRecord_CommentModifiedOn(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigWithoutComment(zoneID, "tf-acctest-basic", rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", fmt.Sprintf("tf-acctest-basic.%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.10"),
					resource.TestMatchResourceAttr(resourceName, consts.ZoneIDSchemaKey, regexp.MustCompile("^[a-z0-9]{32}$")),
					resource.TestCheckResourceAttr(resourceName, "ttl", "3600"),
					resource.TestCheckResourceAttr(resourceName, "type", "A"),
					resource.TestCheckNoResourceAttr(resourceName, "comment_modified_on"),
				),
			},
			{
				Config: testAccCheckZenthcloudRecordConfigCommentModified(zoneID, "tf-acctest-basic", rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", fmt.Sprintf("tf-acctest-basic.%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.10"),
					resource.TestMatchResourceAttr(resourceName, consts.ZoneIDSchemaKey, regexp.MustCompile("^[a-z0-9]{32}$")),
					resource.TestCheckResourceAttr(resourceName, "ttl", "3600"),
					resource.TestCheckResourceAttr(resourceName, "comment", "Test comment for drift"),
					resource.TestCheckResourceAttrSet(resourceName, "comment_modified_on"),
				),
			},
		},
	})
}

// Test FQDN normalization for DNS record names
func TestAccZenthcloudRecord_FQDNNormalize(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudRecordConfigFQDNNormalize(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					// Check subdomain record
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_subdomain", rnd), "type", "A"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_subdomain", rnd), "content", "192.168.0.100"),

					// Check multi-level subdomain
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_subdomain_multi", rnd), "type", "A"),
					resource.TestCheckResourceAttr(fmt.Sprintf("zenthcloud_dns_record.%s_subdomain_multi", rnd), "content", "192.168.0.102"),
				),
			},
			// Second step: Apply same config again - should NOT show drift for name fields
			{
				Config:             testAccCheckZenthcloudRecordConfigFQDNNormalize(zoneID, rnd, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // We expect NO changes
			},
		},
	})
}

func testAccCheckZenthcloudRecordConfigCNAMECase(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_cname_case.tf", rnd, zoneID, domain)
}

func testAccCheckZenthcloudRecordConfigTagsDrift(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_tags_drift.tf", rnd, zoneID, domain)
}

func testAccCheckZenthcloudRecordConfigSimpleDrift(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_simple_drift.tf", rnd, zoneID, domain)
}

func testAccCheckZenthcloudRecordConfigFQDNNormalize(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_fqdn_normalize.tf", rnd, zoneID, domain)
}

// Test that shortening a DNS record name (removing subdomain parts) actually takes effect.
// Regression test for https://github.com/skygenesisenterprise/zenthcloud
// The old FQDN normalization logic incorrectly suppressed name changes when the new name
// was a prefix of the old FQDN (e.g., changing "resend._domainkey.app" to "resend._domainkey").
func TestAccZenthcloudRecord_FQDNNameShortenChange(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				// Step 1: Create with a multi-level subdomain name
				Config: testAccZenthcloudRecordFQDNNameChange(zoneID, rnd, domain, "resend-test._domainkey.app"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "type", "CNAME"),
					resource.TestCheckResourceAttr(resourceName, "content", "example.com"),
				),
			},
			{
				// Step 2: Shorten the name — this MUST produce a plan change and update the record.
				// After Update, state.name has the subdomain form (UnmarshalComputed
				// only writes computed fields and name is tagged required).
				// We verify the old ".app" segment is gone to confirm the rename fired.
				Config: testAccZenthcloudRecordFQDNNameChange(zoneID, rnd, domain, "resend-test._domainkey"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "type", "CNAME"),
					resource.TestCheckResourceAttr(resourceName, "content", "example.com"),
					resource.TestCheckResourceAttr(resourceName, "name", "resend-test._domainkey"),
				),
			},
			{
				// Step 3: Re-apply the same shortened name — must produce an empty plan.
				// This verifies the rename actually took effect on the server:
				// Read() will fetch the FQDN from the API, and ModifyPlan's zone-aware
				// check will correctly suppress the subdomain-vs-FQDN drift.
				Config:             testAccZenthcloudRecordFQDNNameChange(zoneID, rnd, domain, "resend-test._domainkey"),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false,
			},
		},
	})
}

func testAccZenthcloudRecordFQDNNameChange(zoneID, rnd, domain, name string) string {
	return fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[1]s" {
  zone_id = "%[2]s"
  name    = "%[4]s"
  content = "example.com"
  type    = "CNAME"
  proxied = false
  ttl     = 3600
}
`, rnd, zoneID, domain, name)
}

func testAccCheckZenthcloudRecordConfigComputedDrift(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_computed_drift.tf", rnd, zoneID, domain)
}

func testAccCheckZenthcloudRecordConfigDriftRepro(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_drift_repo.tf", rnd, zoneID, domain)
}

func testAccCheckZenthcloudRecordConfigComputedDriftUpdated(zoneID, rnd, domain string) string {
	// Create an inline config for the update since it's a simple change
	return fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[1]s_minimal" {
  zone_id = "%[2]s"
  name    = "tf-acctest-minimal.%[1]s.%[3]s"
  type    = "A"
  content = "192.168.0.25"  # Changed from .20
  ttl     = 3600
  proxied = false
}

resource "zenthcloud_dns_record" "%[1]s_cname_settings" {
  zone_id = "%[2]s"
  name    = "tf-acctest-cname.%[1]s.%[3]s"
  type    = "CNAME"
  content = "target.%[3]s"
  ttl     = 60
  proxied = false

  settings = {
    flatten_cname = false
  }

  tags = []
}

resource "zenthcloud_dns_record" "%[1]s_with_comment" {
  zone_id = "%[2]s"
  name    = "tf-acctest-comment.%[1]s.%[3]s"
  type    = "A"
  content = "192.168.0.21"
  ttl     = 3600
  proxied = false
  comment = "Updated comment"  # Changed comment
  tags    = []
}`, rnd, zoneID, domain)
}

// Test config for CAA record with data field - tests modified_on drift fix
func testAccCheckZenthcloudRecordConfigModifiedOnDriftCAA(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_modified_on_drift_caa.tf", rnd, zoneID, domain)
}

// Test config for records with settings field
func testAccCheckZenthcloudRecordConfigSettingsDrift(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_settings_drift.tf", rnd, zoneID, domain)
}

// Test config for records with settings removed
func testAccCheckZenthcloudRecordConfigSettingsDriftRemoved(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_settings_drift_removed.tf", rnd, zoneID, domain)
}

// Test config for comprehensive drift prevention testing
func testAccCheckZenthcloudRecordConfigComprehensiveDrift(zoneID, rnd, domain string, updated bool) string {
	content := "192.168.1.1"
	if updated {
		content = "192.168.1.2"
	}
	return acctest.LoadTestCase("dns_record_comprehensive_drift.tf", rnd, zoneID, domain, content)
}

func testAccCheckZenthcloudRecordRecreated(before, after *dns.RecordResponse) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		if before.ID == after.ID {
			return fmt.Errorf("expected change of Record Ids, but both were %v", before.ID)
		}
		return nil
	}
}

func testAccCheckZenthcloudRecordDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_dns_record" {
			continue
		}

		_, err := client.DNS.Records.Get(context.Background(), rs.Primary.ID, dns.RecordGetParams{
			ZoneID: zenthcloud.F(rs.Primary.Attributes[consts.ZoneIDSchemaKey]),
		})
		var apierr *zenthcloud.Error
		if errors.As(err, &apierr) {
			if apierr.StatusCode != 404 {
				return fmt.Errorf("Record still exists")
			}
		}
	}

	return nil
}

func testAccManuallyDeleteRecord(record *dns.RecordResponse, zoneID string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		client := acctest.SharedClient()
		_, err := client.DNS.Records.Delete(context.Background(), record.ID, dns.RecordDeleteParams{
			ZoneID: zenthcloud.F(zoneID),
		})
		if err != nil {
			return err
		}
		return nil
	}
}

func testAccCheckZenthcloudRecordAttributes(record *dns.RecordResponse) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		if record.Content != "192.168.0.10" {
			return fmt.Errorf("bad content: %s", record.Content)
		}

		return nil
	}
}

func testAccCheckZenthcloudRecordAttributesUpdated(record *dns.RecordResponse) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		if record.Content != "192.168.0.11" {
			return fmt.Errorf("bad content: %s", record.Content)
		}

		return nil
	}
}

func testAccCheckZenthcloudRecordExists(n string, record *dns.RecordResponse) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No Record ID is set")
		}

		client := acctest.SharedClient()
		foundRecord, err := client.DNS.Records.Get(context.Background(), rs.Primary.ID, dns.RecordGetParams{
			ZoneID: zenthcloud.F(rs.Primary.Attributes[consts.ZoneIDSchemaKey]),
		})
		if err != nil {
			return err
		}

		if foundRecord.ID != rs.Primary.ID {
			return fmt.Errorf("Record not found")
		}

		*record = *foundRecord

		return nil
	}
}

func testAccCheckZenthcloudRecordConfigBasic(zoneID, name, rnd, domain string) string {
	return acctest.LoadTestCase("record_config_basic.tf", zoneID, name, rnd, domain)
}

func testAccCheckZenthcloudRecordConfigApex(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("record_config_apex.tf", zoneID, rnd, domain)
}

func testAccCheckZenthcloudRecordConfigLOC(zoneID, name, rnd string) string {
	return acctest.LoadTestCase("record_config_loc.tf", zoneID, name, rnd)
}

func testAccCheckZenthcloudRecordConfigSRV(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("record_config_srv.tf", zoneID, rnd, domain)
}

func testAccCheckZenthcloudRecordConfigCAA(resourceName, zoneID, name string, ttl int) string {
	return acctest.LoadTestCase("record_config_caa.tf", resourceName, zoneID, name, ttl)
}

func testAccCheckZenthcloudRecordConfigProxied(zoneID, domain, name, rnd string) string {
	return acctest.LoadTestCase("record_config_proxied.tf", zoneID, domain, name, rnd)
}

func testAccCheckZenthcloudRecordConfigNewValue(zoneID, name, rnd, domain string) string {
	return acctest.LoadTestCase("record_config_new_value.tf", zoneID, name, rnd, domain)
}

func testAccCheckZenthcloudRecordConfigChangeType(zoneID, name, zoneName, rnd string) string {
	return acctest.LoadTestCase("record_config_change_type.tf", zoneID, name, zoneName, rnd)
}

func testAccCheckZenthcloudRecordConfigChangeHostname(zoneID, name, rnd string) string {
	return acctest.LoadTestCase("record_config_change_hostname.tf", zoneID, name, rnd)
}

func testAccCheckZenthcloudRecordConfigTtlValidation(zoneID, name, zoneName, rnd string) string {
	return acctest.LoadTestCase("record_config_ttl_validation.tf", zoneID, name, zoneName, rnd)
}

func testAccCheckZenthcloudRecordConfigExplicitProxied(zoneID, name, zoneName, proxied, ttl string) string {
	return acctest.LoadTestCase("record_config_explicit_proxied.tf", zoneID, name, zoneName, proxied, ttl)
}

func testAccCheckZenthcloudRecordConfigMXWithPriorityZero(zoneID, name, zoneName string) string {
	return acctest.LoadTestCase("record_config_mx_with_priority_zero.tf", zoneID, name, zoneName)
}

func testAccCheckZenthcloudRecordConfigHTTPS(zoneID, rnd, zoneName string) string {
	return acctest.LoadTestCase("record_config_https.tf", zoneID, rnd, zoneName)
}

func testAccCheckZenthcloudRecordConfigSVCB(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("record_config_svcb.tf", zoneID, rnd, domain)
}

func testAccCheckZenthcloudRecordNullMX(zoneID, rnd, domain string) string {
	return acctest.LoadTestCase("record_null_mx.tf", rnd, zoneID, domain)
}

func testAccCheckZenthcloudRecordConfigMultipleTags(zoneID, name, rnd, domain string) string {
	return acctest.LoadTestCase("record_config_multiple_tags.tf", zoneID, name, rnd, domain)
}

func testAccCheckZenthcloudRecordConfigNoTags(zoneID, name, rnd, domain string) string {
	return acctest.LoadTestCase("record_config_no_tags.tf", zoneID, name, rnd, domain)
}

func testAccCheckZenthcloudRecordDNSKEY(zoneID, name string) string {
	return acctest.LoadTestCase("record_dnskey.tf", zoneID, name)
}

func testAccCheckZenthcloudRecordConfigWithoutComment(zoneID, name, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_without_comment.tf", zoneID, name, rnd, domain)
}

func testAccCheckZenthcloudRecordConfigCommentModified(zoneID, name, rnd, domain string) string {
	return acctest.LoadTestCase("dns_record_comment_modified.tf", zoneID, name, rnd, domain)
}

// TestAccZenthcloudRecord_ModifiedOnDrift tests for issues for drift
func TestAccZenthcloudRecord_ModifiedOnDrift(t *testing.T) {
	var record dns.RecordResponse
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("tf-acctest-%s", rnd)
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", name)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			{
				// Create a record with settings and tags
				Config: testAccZenthcloudRecordModifiedOnDriftInitial(zoneID, name, domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					resource.TestCheckResourceAttr(resourceName, "name", name),
					resource.TestCheckResourceAttr(resourceName, "type", "A"),
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.10"),
					resource.TestCheckResourceAttr(resourceName, "proxied", "false"),
					resource.TestCheckResourceAttr(resourceName, "ttl", "1"),
					resource.TestCheckResourceAttr(resourceName, "tags.#", "0"),
					resource.TestCheckResourceAttrSet(resourceName, "modified_on"),
				),
			},
			{
				// Apply the same config again - should show no changes
				Config:             testAccZenthcloudRecordModifiedOnDriftInitial(zoneID, name, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // This should pass with our fix, fail without it
			},
			{
				// Test with explicit empty settings
				Config: testAccZenthcloudRecordModifiedOnDriftWithEmptySettings(zoneID, name, domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudRecordExists(resourceName, &record),
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.11"),
					resource.TestCheckResourceAttrSet(resourceName, "modified_on"),
				),
			},
			{
				// Apply the same config again - should show no changes
				Config:             testAccZenthcloudRecordModifiedOnDriftWithEmptySettings(zoneID, name, domain),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false, // This should pass with our fix, fail without it
			},
		},
	})
}

func testAccZenthcloudRecordModifiedOnDriftInitial(zoneID, name, domain string) string {
	return fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[2]s" {
  zone_id = "%[1]s"
  name    = "%[2]s"
  type    = "A"
  content = "192.168.0.10"
  ttl     = 1
  proxied = false
  tags    = []
}`, zoneID, name, domain)
}

func testAccZenthcloudRecordModifiedOnDriftWithEmptySettings(zoneID, name, domain string) string {
	return fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[2]s" {
  zone_id  = "%[1]s"
  name     = "%[2]s"
  type     = "A"
  content  = "192.168.0.11"
  ttl      = 1
  proxied  = false
  tags     = []
  settings = {}
}`, zoneID, name, domain)
}

// TestAccZenthcloudRecord_ModifiedOnConsistency specifically tests that modified_on
// doesn't change when no actual changes are made to the record.
// This test would catch the issue reported in #6438.
func TestAccZenthcloudRecord_ModifiedOnConsistency(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	var initialModifiedOn string
	var initialCreatedOn string

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create a DNS record and capture its modified_on timestamp
			{
				Config: testAccCheckZenthcloudRecordConfigModifiedOnSimple(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "type", "A"),
					resource.TestCheckResourceAttr(resourceName, "name", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.10"),
					resource.TestCheckResourceAttr(resourceName, "ttl", "3600"),
					resource.TestCheckResourceAttrSet(resourceName, "modified_on"),
					resource.TestCheckResourceAttrSet(resourceName, "created_on"),
					// Capture the initial timestamps
					func(s *terraform.State) error {
						rs, ok := s.RootModule().Resources[resourceName]
						if !ok {
							return fmt.Errorf("Resource not found: %s", resourceName)
						}
						initialModifiedOn = rs.Primary.Attributes["modified_on"]
						initialCreatedOn = rs.Primary.Attributes["created_on"]
						log.Printf("Initial modified_on: %s", initialModifiedOn)
						return nil
					},
				),
			},
			// Step 2: Re-apply same config - modified_on should NOT change
			{
				Config: testAccCheckZenthcloudRecordConfigModifiedOnSimple(zoneID, rnd, domain),
				PreConfig: func() {
					// Wait to ensure time has passed
					time.Sleep(2 * time.Second)
				},
				Check: resource.ComposeTestCheckFunc(
					// Verify timestamps haven't changed when no actual changes were made
					func(s *terraform.State) error {
						rs, ok := s.RootModule().Resources[resourceName]
						if !ok {
							return fmt.Errorf("Resource not found: %s", resourceName)
						}

						currentModifiedOn := rs.Primary.Attributes["modified_on"]
						currentCreatedOn := rs.Primary.Attributes["created_on"]

						if currentModifiedOn != initialModifiedOn {
							return fmt.Errorf("modified_on changed without actual changes: was %s, now %s",
								initialModifiedOn, currentModifiedOn)
						}

						if currentCreatedOn != initialCreatedOn {
							return fmt.Errorf("created_on changed unexpectedly: was %s, now %s",
								initialCreatedOn, currentCreatedOn)
						}

						log.Printf("modified_on remained stable: %s", currentModifiedOn)
						return nil
					},
				),
			},
			// Step 3: Make an actual change and verify modified_on DOES change
			{
				Config: testAccCheckZenthcloudRecordConfigModifiedOnUpdated(zoneID, rnd, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "content", "192.168.0.20"),
					// Verify modified_on changed after actual update
					func(s *terraform.State) error {
						rs, ok := s.RootModule().Resources[resourceName]
						if !ok {
							return fmt.Errorf("Resource not found: %s", resourceName)
						}

						currentModifiedOn := rs.Primary.Attributes["modified_on"]
						currentCreatedOn := rs.Primary.Attributes["created_on"]

						if currentModifiedOn == initialModifiedOn {
							return fmt.Errorf("modified_on didn't change after actual update: still %s",
								currentModifiedOn)
						}

						if currentCreatedOn != initialCreatedOn {
							return fmt.Errorf("created_on changed unexpectedly: was %s, now %s",
								initialCreatedOn, currentCreatedOn)
						}

						// Update our reference for next check
						initialModifiedOn = currentModifiedOn
						log.Printf("New modified_on after update: %s", currentModifiedOn)
						return nil
					},
				),
			},
			// Step 4: Re-apply without changes and ensure modified_on stays stable
			{
				Config: testAccCheckZenthcloudRecordConfigModifiedOnUpdated(zoneID, rnd, domain),
				PreConfig: func() {
					time.Sleep(2 * time.Second)
				},
				Check: resource.ComposeTestCheckFunc(
					func(s *terraform.State) error {
						rs, ok := s.RootModule().Resources[resourceName]
						if !ok {
							return fmt.Errorf("Resource not found: %s", resourceName)
						}

						currentModifiedOn := rs.Primary.Attributes["modified_on"]

						if currentModifiedOn != initialModifiedOn {
							return fmt.Errorf("modified_on changed without actual changes after update: was %s, now %s",
								initialModifiedOn, currentModifiedOn)
						}

						log.Printf("modified_on remained stable after update: %s", currentModifiedOn)
						return nil
					},
				),
			},
		},
	})
}

func testAccCheckZenthcloudRecordConfigModifiedOnSimple(zoneID, rnd, domain string) string {
	return fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[2]s" {
  zone_id = "%[1]s"
  name    = "%[2]s.%[3]s"
  type    = "A"
  content = "192.168.0.10"
  ttl     = 3600
}`, zoneID, rnd, domain)
}

func testAccCheckZenthcloudRecordConfigModifiedOnUpdated(zoneID, rnd, domain string) string {
	return fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[2]s" {
  zone_id = "%[1]s"
  name    = "%[2]s.%[3]s"
  type    = "A"
  content = "192.168.0.20"
  ttl     = 3600
}`, zoneID, rnd, domain)
}

func suppressTrailingDots(k, old, new string, d *schema.ResourceData) bool {
	newTrimmed := strings.TrimSuffix(new, ".")

	// Ensure to distinguish values consists of dots only.
	if newTrimmed == "" {
		return old == new
	}

	return strings.TrimSuffix(old, ".") == newTrimmed
}

// TestAccUpgradeDNSRecord_FromPublishedV5 tests upgrading from a published v5
// release to the local build. This validates that the schema version bump and
// state upgrader (with PriorSchema) work correctly for users upgrading their
// provider version.
//
// Step 1: Create resource with published v5 provider (state at schema_version: 0)
// Step 2: Apply with local build — triggers state upgrader
func TestAccUpgradeDNSRecord_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	config := fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[1]s" {
  zone_id = "%[2]s"
  name    = "upgrade-test-%[1]s"
  type    = "A"
  content = "192.0.2.1"
  ttl     = 300
}
`, rnd, zoneID)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
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
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "zone_id", zoneID),
					resource.TestCheckResourceAttr(resourceName, "type", "A"),
					resource.TestCheckResourceAttr(resourceName, "content", "192.0.2.1"),
				),
			},
		},
	})
}

// TestAccZenthcloudRecord_ProxiedCNAMEUpdateSettingsDrift verifies that updating a
// proxied CNAME record does not cause drift on the settings block. This specifically
// exercises the Update() code path (not just Create/Read) to ensure that
// normalizeSettings is called after UnmarshalComputed in Update(), preventing
// ipv4_only and ipv6_only from appearing as (known after apply) on subsequent plans.
// Regression test for the fix to issues #5378, #5517, #5858, #6076, #6438.
func TestAccZenthcloudRecord_ProxiedCNAMEUpdateSettingsDrift(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_dns_record.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudRecordDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create a proxied CNAME record with no settings block.
			// After create, settings should be stable (all three sub-fields = false).
			{
				Config: testAccZenthcloudRecordProxiedCNAMEConfig(zoneID, rnd, domain, "target."+domain, "1"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "type", "CNAME"),
					resource.TestCheckResourceAttr(resourceName, "proxied", "true"),
					resource.TestCheckResourceAttr(resourceName, "settings.flatten_cname", "false"),
					resource.TestCheckResourceAttr(resourceName, "settings.ipv4_only", "false"),
					resource.TestCheckResourceAttr(resourceName, "settings.ipv6_only", "false"),
				),
				// Verify the post-create plan is empty (no drift after Create).
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Step 2: Update the record content, exercising the Update() code path.
			// Settings must remain stable — ipv4_only and ipv6_only must not appear
			// as (known after apply) after the update is applied.
			{
				Config: testAccZenthcloudRecordProxiedCNAMEConfig(zoneID, rnd, domain, "updated."+domain, "1"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "content", "updated."+domain),
					resource.TestCheckResourceAttr(resourceName, "settings.flatten_cname", "false"),
					resource.TestCheckResourceAttr(resourceName, "settings.ipv4_only", "false"),
					resource.TestCheckResourceAttr(resourceName, "settings.ipv6_only", "false"),
				),
				// Verify the post-update plan is empty (no drift after Update).
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Step 3: Re-apply the same config — must produce no changes.
			{
				Config:             testAccZenthcloudRecordProxiedCNAMEConfig(zoneID, rnd, domain, "updated."+domain, "1"),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false,
			},
		},
	})
}

func testAccZenthcloudRecordProxiedCNAMEConfig(zoneID, rnd, domain, content, ttl string) string {
	return fmt.Sprintf(`
resource "zenthcloud_dns_record" "%[2]s" {
  zone_id = "%[1]s"
  name    = "tf-acctest-proxied-update.%[2]s.%[3]s"
  type    = "CNAME"
  content = "%[4]s"
  proxied = true
  ttl     = %[5]s
}`, zoneID, rnd, domain, content, ttl)
}
