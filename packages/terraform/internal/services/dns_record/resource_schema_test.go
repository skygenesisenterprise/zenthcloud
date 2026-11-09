// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package dns_record_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/dns_record"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestDNSRecordModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*dns_record.DNSRecordModel)(nil)
	schema := dns_record.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
