package email_security_block_sender

import (
	"context"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/email_security_block_sender/migration/v500"
	"github.com/hashicorp/terraform-plugin-framework/resource"
)

var _ resource.ResourceWithUpgradeState = (*EmailSecurityBlockSenderResource)(nil)

func (r *EmailSecurityBlockSenderResource) UpgradeState(ctx context.Context) map[int64]resource.StateUpgrader {
	ps := v500.PriorSchema()
	return map[int64]resource.StateUpgrader{
		0: {
			PriorSchema:   &ps,
			StateUpgrader: v500.UpgradeFromV0,
		},
	}
}
