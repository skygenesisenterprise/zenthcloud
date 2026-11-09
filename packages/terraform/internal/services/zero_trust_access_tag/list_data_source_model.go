// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_access_tag

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustAccessTagsResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[ZeroTrustAccessTagsResultDataSourceModel] `json:"result,computed"`
}

type ZeroTrustAccessTagsDataSourceModel struct {
	AccountID types.String                                                           `tfsdk:"account_id" path:"account_id,optional"`
	MaxItems  types.Int64                                                            `tfsdk:"max_items"`
	Result    customfield.NestedObjectList[ZeroTrustAccessTagsResultDataSourceModel] `tfsdk:"result"`
}

func (m *ZeroTrustAccessTagsDataSourceModel) toListParams(_ context.Context) (params zero_trust.AccessTagListParams, diags diag.Diagnostics) {
	params = zero_trust.AccessTagListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}

type ZeroTrustAccessTagsResultDataSourceModel struct {
	ID   types.String `tfsdk:"id" json:"name,computed"`
	Name types.String `tfsdk:"name" json:"name,computed"`
}
