// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package account_api_token_permission_groups

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/accounts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type AccountAPITokenPermissionGroupsListResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[AccountAPITokenPermissionGroupsListResultDataSourceModel] `json:"result,computed"`
}

type AccountAPITokenPermissionGroupsListDataSourceModel struct {
	AccountID types.String                                                                           `tfsdk:"account_id" path:"account_id,optional"`
	Name      types.String                                                                           `tfsdk:"name" query:"name,optional"`
	Scope     types.String                                                                           `tfsdk:"scope" query:"scope,optional"`
	MaxItems  types.Int64                                                                            `tfsdk:"max_items"`
	Result    customfield.NestedObjectList[AccountAPITokenPermissionGroupsListResultDataSourceModel] `tfsdk:"result"`
}

func (m *AccountAPITokenPermissionGroupsListDataSourceModel) toListParams(_ context.Context) (params accounts.TokenPermissionGroupListParams, diags diag.Diagnostics) {
	params = accounts.TokenPermissionGroupListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	if !m.Name.IsNull() {
		params.Name = zenthcloud.F(m.Name.ValueString())
	}
	if !m.Scope.IsNull() {
		params.Scope = zenthcloud.F(m.Scope.ValueString())
	}

	return
}

type AccountAPITokenPermissionGroupsListResultDataSourceModel struct {
	ID           types.String                   `tfsdk:"id" json:"id,computed"`
	Category     types.String                   `tfsdk:"category" json:"category,computed"`
	IsSelectable types.Bool                     `tfsdk:"is_selectable" json:"is_selectable,computed"`
	Name         types.String                   `tfsdk:"name" json:"name,computed"`
	Scopes       customfield.List[types.String] `tfsdk:"scopes" json:"scopes,computed"`
}
