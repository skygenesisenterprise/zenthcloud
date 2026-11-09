// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package access_rule

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/firewall"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type AccessRulesResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[AccessRulesResultDataSourceModel] `json:"result,computed"`
}

type AccessRulesDataSourceModel struct {
	AccountID     types.String                                                   `tfsdk:"account_id" path:"account_id,optional"`
	ZoneID        types.String                                                   `tfsdk:"zone_id" path:"zone_id,optional"`
	Direction     types.String                                                   `tfsdk:"direction" query:"direction,optional"`
	Mode          types.String                                                   `tfsdk:"mode" query:"mode,optional"`
	Notes         types.String                                                   `tfsdk:"notes" query:"notes,optional"`
	Order         types.String                                                   `tfsdk:"order" query:"order,optional"`
	Configuration *AccessRulesFilterConfigurationDataSourceModel                 `tfsdk:"configuration" query:"configuration,optional"`
	Match         types.String                                                   `tfsdk:"match" query:"match,computed_optional"`
	MaxItems      types.Int64                                                    `tfsdk:"max_items"`
	Result        customfield.NestedObjectList[AccessRulesResultDataSourceModel] `tfsdk:"result"`
}

func (m *AccessRulesDataSourceModel) toListParams(_ context.Context) (params firewall.AccessRuleListParams, diags diag.Diagnostics) {
	params = firewall.AccessRuleListParams{}

	if m.Configuration != nil {
		paramsConfiguration := firewall.AccessRuleListParamsConfiguration{}
		if !m.Configuration.Target.IsNull() {
			paramsConfiguration.Target = zenthcloud.F(firewall.AccessRuleListParamsConfigurationTarget(m.Configuration.Target.ValueString()))
		}
		if !m.Configuration.Value.IsNull() {
			paramsConfiguration.Value = zenthcloud.F(m.Configuration.Value.ValueString())
		}
		params.Configuration = zenthcloud.F(paramsConfiguration)
	}
	if !m.Direction.IsNull() {
		params.Direction = zenthcloud.F(firewall.AccessRuleListParamsDirection(m.Direction.ValueString()))
	}
	if !m.Match.IsNull() {
		params.Match = zenthcloud.F(firewall.AccessRuleListParamsMatch(m.Match.ValueString()))
	}
	if !m.Mode.IsNull() {
		params.Mode = zenthcloud.F(firewall.AccessRuleListParamsMode(m.Mode.ValueString()))
	}
	if !m.Notes.IsNull() {
		params.Notes = zenthcloud.F(m.Notes.ValueString())
	}
	if !m.Order.IsNull() {
		params.Order = zenthcloud.F(firewall.AccessRuleListParamsOrder(m.Order.ValueString()))
	}

	if !m.AccountID.IsNull() {
		params.AccountID = zenthcloud.F(m.AccountID.ValueString())
	} else {
		params.ZoneID = zenthcloud.F(m.ZoneID.ValueString())
	}

	return
}

// AccessRulesFilterConfigurationDataSourceModel is used for query parameters (optional input)
type AccessRulesFilterConfigurationDataSourceModel struct {
	Target types.String `tfsdk:"target" json:"target,optional"`
	Value  types.String `tfsdk:"value" json:"value,optional"`
}

// AccessRulesConfigurationDataSourceModel is used for result data (computed output)
type AccessRulesConfigurationDataSourceModel struct {
	Target types.String `tfsdk:"target" json:"target,computed"`
	Value  types.String `tfsdk:"value" json:"value,computed"`
}

type AccessRulesResultDataSourceModel struct {
	ID            types.String                                                      `tfsdk:"id" json:"id,computed"`
	AllowedModes  customfield.List[types.String]                                    `tfsdk:"allowed_modes" json:"allowed_modes,computed"`
	Configuration customfield.NestedObject[AccessRulesConfigurationDataSourceModel] `tfsdk:"configuration" json:"configuration,computed"`
	Mode          types.String                                                      `tfsdk:"mode" json:"mode,computed"`
	CreatedOn     timetypes.RFC3339                                                 `tfsdk:"created_on" json:"created_on,computed" format:"date-time"`
	ModifiedOn    timetypes.RFC3339                                                 `tfsdk:"modified_on" json:"modified_on,computed" format:"date-time"`
	Notes         types.String                                                      `tfsdk:"notes" json:"notes,computed"`
	Scope         customfield.NestedObject[AccessRulesScopeDataSourceModel]         `tfsdk:"scope" json:"scope,computed"`
}

type AccessRulesScopeDataSourceModel struct {
	ID    types.String `tfsdk:"id" json:"id,computed"`
	Email types.String `tfsdk:"email" json:"email,computed"`
	Type  types.String `tfsdk:"type" json:"type,computed"`
}
