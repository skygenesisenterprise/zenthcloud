// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package calls_turn_app

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/calls"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type CallsTURNAppResultDataSourceEnvelope struct {
	Result CallsTURNAppDataSourceModel `json:"result,computed"`
}

type CallsTURNAppDataSourceModel struct {
	AccountID types.String      `tfsdk:"account_id" path:"account_id,required"`
	KeyID     types.String      `tfsdk:"key_id" path:"key_id,required"`
	Created   timetypes.RFC3339 `tfsdk:"created" json:"created,computed" format:"date-time"`
	Modified  timetypes.RFC3339 `tfsdk:"modified" json:"modified,computed" format:"date-time"`
	Name      types.String      `tfsdk:"name" json:"name,computed"`
	UID       types.String      `tfsdk:"uid" json:"uid,computed"`
}

func (m *CallsTURNAppDataSourceModel) toReadParams(_ context.Context) (params calls.TURNGetParams, diags diag.Diagnostics) {
	params = calls.TURNGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}
