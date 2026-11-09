// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_token

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddTokenResultDataSourceEnvelope struct {
	Result types.String `json:"result,computed"`
}

type ZeroTrustTunnelZenthclouddTokenDataSourceModel struct {
	AccountID types.String `tfsdk:"account_id" path:"account_id,required"`
	TunnelID  types.String `tfsdk:"tunnel_id" path:"tunnel_id,required"`
	Token     types.String `tfsdk:"token" json:"token,computed"`
}

func (m *ZeroTrustTunnelZenthclouddTokenDataSourceModel) toReadParams(_ context.Context) (params zero_trust.TunnelZenthclouddTokenGetParams, diags diag.Diagnostics) {
	params = zero_trust.TunnelZenthclouddTokenGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}
