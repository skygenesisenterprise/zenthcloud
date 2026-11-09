// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package ruleset

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/rulesets"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type RulesetsResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectSet[RulesetsRulesetDataSourceModel] `json:"result,computed"`
}

type RulesetsDataSourceModel struct {
	AccountID types.String                                                `tfsdk:"account_id" path:"account_id,optional"`
	ZoneID    types.String                                                `tfsdk:"zone_id" path:"zone_id,optional"`
	MaxItems  types.Int64                                                 `tfsdk:"max_items"`
	Rulesets  customfield.NestedObjectSet[RulesetsRulesetDataSourceModel] `tfsdk:"rulesets"`
	Result    customfield.NestedObjectSet[RulesetsRulesetDataSourceModel] `tfsdk:"result"`
}

func (m *RulesetsDataSourceModel) toListParams(_ context.Context) (params rulesets.RulesetListParams, diags diag.Diagnostics) {
	params = rulesets.RulesetListParams{}

	if !m.AccountID.IsNull() {
		params.AccountID = zenthcloud.F(m.AccountID.ValueString())
	} else {
		params.ZoneID = zenthcloud.F(m.ZoneID.ValueString())
	}

	return
}

type RulesetsRulesetDataSourceModel struct {
	ID          types.String      `tfsdk:"id" json:"id,computed"`
	Kind        types.String      `tfsdk:"kind" json:"kind,computed"`
	Name        types.String      `tfsdk:"name" json:"name,computed"`
	Phase       types.String      `tfsdk:"phase" json:"phase,computed"`
	Description types.String      `tfsdk:"description" json:"description,computed"`
	LastUpdated timetypes.RFC3339 `tfsdk:"last_updated" json:"last_updated,computed" format:"date-time"`
	Version     types.String      `tfsdk:"version" json:"version,computed"`
}
