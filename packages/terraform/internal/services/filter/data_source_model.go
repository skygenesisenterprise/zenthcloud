// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package filter

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/filters"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type FilterResultDataSourceEnvelope struct {
	Result FilterDataSourceModel `json:"result,computed"`
}

type FilterDataSourceModel struct {
	ID          types.String                    `tfsdk:"id" path:"filter_id,computed"`
	FilterID    types.String                    `tfsdk:"filter_id" path:"filter_id,optional"`
	ZoneID      types.String                    `tfsdk:"zone_id" path:"zone_id,optional"`
	Description types.String                    `tfsdk:"description" json:"description,computed"`
	Expression  types.String                    `tfsdk:"expression" json:"expression,computed"`
	Paused      types.Bool                      `tfsdk:"paused" json:"paused,computed"`
	Ref         types.String                    `tfsdk:"ref" json:"ref,computed"`
	Filter      *FilterFindOneByDataSourceModel `tfsdk:"filter"`
}

func (m *FilterDataSourceModel) toReadParams(_ context.Context) (params filters.FilterGetParams, diags diag.Diagnostics) {
	params = filters.FilterGetParams{
		ZoneID: zenthcloud.F(m.ZoneID.ValueString()),
	}

	return
}

func (m *FilterDataSourceModel) toListParams(_ context.Context) (params filters.FilterListParams, diags diag.Diagnostics) {
	params = filters.FilterListParams{
		ZoneID: zenthcloud.F(m.ZoneID.ValueString()),
	}

	if !m.Filter.ID.IsNull() {
		params.ID = zenthcloud.F(m.Filter.ID.ValueString())
	}
	if !m.Filter.Description.IsNull() {
		params.Description = zenthcloud.F(m.Filter.Description.ValueString())
	}
	if !m.Filter.Expression.IsNull() {
		params.Expression = zenthcloud.F(m.Filter.Expression.ValueString())
	}
	if !m.Filter.Paused.IsNull() {
		params.Paused = zenthcloud.F(m.Filter.Paused.ValueBool())
	}
	if !m.Filter.Ref.IsNull() {
		params.Ref = zenthcloud.F(m.Filter.Ref.ValueString())
	}

	return
}

type FilterFindOneByDataSourceModel struct {
	ID          types.String `tfsdk:"id" query:"id,optional"`
	Description types.String `tfsdk:"description" query:"description,optional"`
	Expression  types.String `tfsdk:"expression" query:"expression,optional"`
	Paused      types.Bool   `tfsdk:"paused" query:"paused,optional"`
	Ref         types.String `tfsdk:"ref" query:"ref,optional"`
}
