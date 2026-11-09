// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package workers_script

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/workers"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type WorkersScriptDataSourceModel struct {
	ID         types.String                           `tfsdk:"id" path:"script_name,computed"`
	ScriptName types.String                           `tfsdk:"script_name" path:"script_name,optional"`
	AccountID  types.String                           `tfsdk:"account_id" path:"account_id,optional"`
	Script     types.String                           `tfsdk:"script" json:"script,computed"`
	Filter     *WorkersScriptFindOneByDataSourceModel `tfsdk:"filter"`
}

func (m *WorkersScriptDataSourceModel) toReadParams(_ context.Context) (params workers.ScriptGetParams, diags diag.Diagnostics) {
	params = workers.ScriptGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}

func (m *WorkersScriptDataSourceModel) toListParams(_ context.Context) (params workers.ScriptListParams, diags diag.Diagnostics) {
	params = workers.ScriptListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	if !m.Filter.Tags.IsNull() {
		params.Tags = zenthcloud.F(m.Filter.Tags.ValueString())
	}

	return
}

type WorkersScriptFindOneByDataSourceModel struct {
	Tags types.String `tfsdk:"tags" query:"tags,optional"`
}
