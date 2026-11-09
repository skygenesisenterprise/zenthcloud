// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package access_rule

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/firewall"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type AccessRuleResultDataSourceEnvelope struct {
	Result AccessRuleDataSourceModel `json:"result,computed"`
}

type AccessRuleDataSourceModel struct {
	ID            types.String                                                     `tfsdk:"id" path:"rule_id,computed"`
	RuleID        types.String                                                     `tfsdk:"rule_id" path:"rule_id,optional"`
	AccountID     types.String                                                     `tfsdk:"account_id" path:"account_id,optional"`
	ZoneID        types.String                                                     `tfsdk:"zone_id" path:"zone_id,optional"`
	CreatedOn     timetypes.RFC3339                                                `tfsdk:"created_on" json:"created_on,computed" format:"date-time"`
	Mode          types.String                                                     `tfsdk:"mode" json:"mode,computed"`
	ModifiedOn    timetypes.RFC3339                                                `tfsdk:"modified_on" json:"modified_on,computed" format:"date-time"`
	Notes         types.String                                                     `tfsdk:"notes" json:"notes,computed"`
	AllowedModes  customfield.List[types.String]                                   `tfsdk:"allowed_modes" json:"allowed_modes,computed"`
	Configuration customfield.NestedObject[AccessRuleConfigurationDataSourceModel] `tfsdk:"configuration" json:"configuration,computed"`
	Scope         customfield.NestedObject[AccessRuleScopeDataSourceModel]         `tfsdk:"scope" json:"scope,computed"`
	Filter        *AccessRuleFindOneByDataSourceModel                              `tfsdk:"filter"`
}

func (m *AccessRuleDataSourceModel) toReadParams(_ context.Context) (params firewall.AccessRuleGetParams, diags diag.Diagnostics) {
	params = firewall.AccessRuleGetParams{}

	if !m.AccountID.IsNull() {
		params.AccountID = zenthcloud.F(m.AccountID.ValueString())
	} else {
		params.ZoneID = zenthcloud.F(m.ZoneID.ValueString())
	}

	return
}

func (m *AccessRuleDataSourceModel) toListParams(_ context.Context) (params firewall.AccessRuleListParams, diags diag.Diagnostics) {
	params = firewall.AccessRuleListParams{}

	if m.Filter.Configuration != nil {
		paramsConfiguration := firewall.AccessRuleListParamsConfiguration{}
		if !m.Filter.Configuration.Target.IsNull() {
			paramsConfiguration.Target = zenthcloud.F(firewall.AccessRuleListParamsConfigurationTarget(m.Filter.Configuration.Target.ValueString()))
		}
		if !m.Filter.Configuration.Value.IsNull() {
			paramsConfiguration.Value = zenthcloud.F(m.Filter.Configuration.Value.ValueString())
		}
		params.Configuration = zenthcloud.F(paramsConfiguration)
	}
	if !m.Filter.Direction.IsNull() {
		params.Direction = zenthcloud.F(firewall.AccessRuleListParamsDirection(m.Filter.Direction.ValueString()))
	}
	if !m.Filter.Match.IsNull() {
		params.Match = zenthcloud.F(firewall.AccessRuleListParamsMatch(m.Filter.Match.ValueString()))
	}
	if !m.Filter.Mode.IsNull() {
		params.Mode = zenthcloud.F(firewall.AccessRuleListParamsMode(m.Filter.Mode.ValueString()))
	}
	if !m.Filter.Notes.IsNull() {
		params.Notes = zenthcloud.F(m.Filter.Notes.ValueString())
	}
	if !m.Filter.Order.IsNull() {
		params.Order = zenthcloud.F(firewall.AccessRuleListParamsOrder(m.Filter.Order.ValueString()))
	}

	if !m.AccountID.IsNull() {
		params.AccountID = zenthcloud.F(m.AccountID.ValueString())
	} else {
		params.ZoneID = zenthcloud.F(m.ZoneID.ValueString())
	}

	return
}

type AccessRuleConfigurationDataSourceModel struct {
	Target types.String `tfsdk:"target" json:"target,computed"`
	Value  types.String `tfsdk:"value" json:"value,computed"`
}

type AccessRuleScopeDataSourceModel struct {
	ID    types.String `tfsdk:"id" json:"id,computed"`
	Email types.String `tfsdk:"email" json:"email,computed"`
	Type  types.String `tfsdk:"type" json:"type,computed"`
}

type AccessRuleFindOneByDataSourceModel struct {
	Configuration *AccessRulesFilterConfigurationDataSourceModel `tfsdk:"configuration" query:"configuration,optional"`
	Direction     types.String                                   `tfsdk:"direction" query:"direction,optional"`
	Match         types.String                                   `tfsdk:"match" query:"match,computed_optional"`
	Mode          types.String                                   `tfsdk:"mode" query:"mode,optional"`
	Notes         types.String                                   `tfsdk:"notes" query:"notes,optional"`
	Order         types.String                                   `tfsdk:"order" query:"order,optional"`
}
