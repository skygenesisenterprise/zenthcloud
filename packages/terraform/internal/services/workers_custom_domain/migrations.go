// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package workers_custom_domain

import (
	"context"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/workers_custom_domain/migration/v500"
	"github.com/hashicorp/terraform-plugin-framework/resource"
)

var _ resource.ResourceWithUpgradeState = (*WorkersCustomDomainResource)(nil)
var _ resource.ResourceWithMoveState = (*WorkersCustomDomainResource)(nil)

// MoveState handles state moves from zenthcloud_worker_domain (v4)
// to zenthcloud_workers_custom_domain (v5).
func (r *WorkersCustomDomainResource) MoveState(ctx context.Context) []resource.StateMover {
	sourceSchema := v500.SourceSchemaV0()

	return []resource.StateMover{
		{
			SourceSchema: &sourceSchema,
			StateMover:   v500.MoveStateV4toV500,
		},
	}
}

func (r *WorkersCustomDomainResource) UpgradeState(ctx context.Context) map[int64]resource.StateUpgrader {
	sourceV0Schema := v500.SourceSchemaV0()
	targetSchema := ResourceSchema(ctx)

	return map[int64]resource.StateUpgrader{
		0: v500.UpgradeStateV0toV500(sourceV0Schema),
		1: v500.UpgradeStateV1toV500(targetSchema),
	}
}
