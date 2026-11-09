// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package email_routing_dns_test

import (
	"context"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/email_routing_dns"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestEmailRoutingDNSModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*email_routing_dns.EmailRoutingDNSModel)(nil)
	schema := email_routing_dns.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
