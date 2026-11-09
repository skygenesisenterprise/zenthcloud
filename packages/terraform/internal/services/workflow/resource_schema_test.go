// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package workflow_test

import (
	"context"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/services/workflow"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestWorkflowModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*workflow.WorkflowModel)(nil)
	schema := workflow.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}
