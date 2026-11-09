// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package email_security_impersonation_registry_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/email_security_impersonation_registry"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestEmailSecurityImpersonationRegistryModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*email_security_impersonation_registry.EmailSecurityImpersonationRegistryModel)(nil)
	schema := email_security_impersonation_registry.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
