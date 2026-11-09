// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package user_group_members

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/iam"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type UserGroupMembersResultDataSourceEnvelope struct {
	Result *[]*UserGroupMembersDataSourceMembersModel `json:"result,computed"`
}

type UserGroupMembersDataSourceModel struct {
	ID          types.String                               `tfsdk:"id" json:"id,computed"`
	UserGroupID types.String                               `tfsdk:"user_group_id" path:"user_group_id,required"`
	AccountID   types.String                               `tfsdk:"account_id" path:"account_id,required"`
	FuzzyEmail  types.String                               `tfsdk:"fuzzy_email" query:"fuzzyEmail,optional"`
	Direction   types.String                               `tfsdk:"direction" query:"direction,computed_optional"`
	Members     *[]*UserGroupMembersDataSourceMembersModel `tfsdk:"members" json:"members,computed,no_refresh"`
}

type UserGroupMembersDataSourceMembersModel struct {
	ID     types.String `tfsdk:"id" json:"id,computed"`
	Email  types.String `tfsdk:"email" json:"email,computed"`
	Status types.String `tfsdk:"status" json:"status,computed"`
}

func (m *UserGroupMembersDataSourceModel) toReadParams(_ context.Context) (params iam.UserGroupMemberListParams, diags diag.Diagnostics) {
	params = iam.UserGroupMemberListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	if !m.Direction.IsNull() {
		params.Direction = zenthcloud.F(iam.UserGroupMemberListParamsDirection(m.Direction.ValueString()))
	}
	if !m.FuzzyEmail.IsNull() {
		params.FuzzyEmail = zenthcloud.F(m.FuzzyEmail.ValueString())
	}

	return
}
