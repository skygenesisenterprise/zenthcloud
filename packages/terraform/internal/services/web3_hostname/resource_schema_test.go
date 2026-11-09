// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package web3_hostname_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/web3_hostname"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestWeb3HostnameModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*web3_hostname.Web3HostnameModel)(nil)
	schema := web3_hostname.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
