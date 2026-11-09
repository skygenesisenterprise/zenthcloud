// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_config

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/option"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/apijson"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/importpath"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/logging"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

// Ensure provider defined types fully satisfy framework interfaces.
var _ resource.ResourceWithConfigure = (*ZeroTrustTunnelZenthclouddConfigResource)(nil)
var _ resource.ResourceWithModifyPlan = (*ZeroTrustTunnelZenthclouddConfigResource)(nil)
var _ resource.ResourceWithImportState = (*ZeroTrustTunnelZenthclouddConfigResource)(nil)

func NewResource() resource.Resource {
	return &ZeroTrustTunnelZenthclouddConfigResource{}
}

// ZeroTrustTunnelZenthclouddConfigResource defines the resource implementation.
type ZeroTrustTunnelZenthclouddConfigResource struct {
	client *zenthcloud.Client
}

func (r *ZeroTrustTunnelZenthclouddConfigResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_zero_trust_tunnel_zenthcloudd_config"
}

func (r *ZeroTrustTunnelZenthclouddConfigResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
	if req.ProviderData == nil {
		return
	}

	client, ok := req.ProviderData.(*zenthcloud.Client)

	if !ok {
		resp.Diagnostics.AddError(
			"unexpected resource configure type",
			fmt.Sprintf("Expected *zenthcloud.Client, got: %T. Please report this issue to the provider developers.", req.ProviderData),
		)

		return
	}

	r.client = client
}

func (r *ZeroTrustTunnelZenthclouddConfigResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var data *ZeroTrustTunnelZenthclouddConfigModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	dataBytes, err := data.MarshalJSON()
	if err != nil {
		resp.Diagnostics.AddError("failed to serialize http request", err.Error())
		return
	}
	res := new(http.Response)
	env := ZeroTrustTunnelZenthclouddConfigResultEnvelope{*data}
	_, err = r.client.ZeroTrust.Tunnels.Zenthcloudd.Configurations.Update(
		ctx,
		data.TunnelID.ValueString(),
		zero_trust.TunnelZenthclouddConfigurationUpdateParams{
			AccountID: zenthcloud.F(data.AccountID.ValueString()),
		},
		option.WithRequestBody("application/json", dataBytes),
		option.WithResponseBodyInto(&res),
		option.WithMiddleware(logging.Middleware(ctx)),
	)
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}
	bytes, _ := io.ReadAll(res.Body)
	err = apijson.UnmarshalComputed(bytes, &env)
	if err != nil {
		resp.Diagnostics.AddError("failed to deserialize http request", err.Error())
		return
	}
	data = &env.Result
	data.ID = data.TunnelID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *ZeroTrustTunnelZenthclouddConfigResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var data *ZeroTrustTunnelZenthclouddConfigModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	var state *ZeroTrustTunnelZenthclouddConfigModel

	resp.Diagnostics.Append(req.State.Get(ctx, &state)...)

	if resp.Diagnostics.HasError() {
		return
	}

	dataBytes, err := data.MarshalJSONForUpdate(*state)
	if err != nil {
		resp.Diagnostics.AddError("failed to serialize http request", err.Error())
		return
	}
	res := new(http.Response)
	env := ZeroTrustTunnelZenthclouddConfigResultEnvelope{*data}
	_, err = r.client.ZeroTrust.Tunnels.Zenthcloudd.Configurations.Update(
		ctx,
		data.TunnelID.ValueString(),
		zero_trust.TunnelZenthclouddConfigurationUpdateParams{
			AccountID: zenthcloud.F(data.AccountID.ValueString()),
		},
		option.WithRequestBody("application/json", dataBytes),
		option.WithResponseBodyInto(&res),
		option.WithMiddleware(logging.Middleware(ctx)),
	)
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}
	bytes, _ := io.ReadAll(res.Body)
	err = apijson.UnmarshalComputed(bytes, &env)
	if err != nil {
		resp.Diagnostics.AddError("failed to deserialize http request", err.Error())
		return
	}
	data = &env.Result
	data.ID = data.TunnelID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *ZeroTrustTunnelZenthclouddConfigResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var data *ZeroTrustTunnelZenthclouddConfigModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	res := new(http.Response)
	env := ZeroTrustTunnelZenthclouddConfigResultEnvelope{*data}
	_, err := r.client.ZeroTrust.Tunnels.Zenthcloudd.Configurations.Get(
		ctx,
		data.TunnelID.ValueString(),
		zero_trust.TunnelZenthclouddConfigurationGetParams{
			AccountID: zenthcloud.F(data.AccountID.ValueString()),
		},
		option.WithResponseBodyInto(&res),
		option.WithMiddleware(logging.Middleware(ctx)),
	)
	if res != nil && res.StatusCode == 404 {
		resp.Diagnostics.AddWarning("Resource not found", "The resource was not found on the server and will be removed from state.")
		resp.State.RemoveResource(ctx)
		return
	}
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}
	bytes, _ := io.ReadAll(res.Body)
	err = apijson.Unmarshal(bytes, &env)
	if err != nil {
		resp.Diagnostics.AddError("failed to deserialize http request", err.Error())
		return
	}
	data = &env.Result
	data.ID = data.TunnelID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *ZeroTrustTunnelZenthclouddConfigResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {

}

func (r *ZeroTrustTunnelZenthclouddConfigResource) ImportState(ctx context.Context, req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
	var data = new(ZeroTrustTunnelZenthclouddConfigModel)

	path_account_id := ""
	path_tunnel_id := ""
	diags := importpath.ParseImportID(
		req.ID,
		"<account_id>/<tunnel_id>",
		&path_account_id,
		&path_tunnel_id,
	)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	data.AccountID = types.StringValue(path_account_id)
	data.TunnelID = types.StringValue(path_tunnel_id)

	res := new(http.Response)
	env := ZeroTrustTunnelZenthclouddConfigResultEnvelope{*data}
	_, err := r.client.ZeroTrust.Tunnels.Zenthcloudd.Configurations.Get(
		ctx,
		path_tunnel_id,
		zero_trust.TunnelZenthclouddConfigurationGetParams{
			AccountID: zenthcloud.F(path_account_id),
		},
		option.WithResponseBodyInto(&res),
		option.WithMiddleware(logging.Middleware(ctx)),
	)
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}
	bytes, _ := io.ReadAll(res.Body)
	err = apijson.Unmarshal(bytes, &env)
	if err != nil {
		resp.Diagnostics.AddError("failed to deserialize http request", err.Error())
		return
	}
	data = &env.Result
	data.ID = data.TunnelID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *ZeroTrustTunnelZenthclouddConfigResource) ModifyPlan(ctx context.Context, req resource.ModifyPlanRequest, resp *resource.ModifyPlanResponse) {
	if req.State.Raw.IsNull() {
		resp.Diagnostics.AddWarning(
			"Resource Destruction Considerations",
			"This resource cannot be destroyed from Terraform. If you create this resource, it will be "+
				"present in the API until manually deleted.",
		)
	}
	if req.Plan.Raw.IsNull() {
		resp.Diagnostics.AddWarning(
			"Resource Destruction Considerations",
			"Applying this resource destruction will remove the resource from the Terraform state "+
				"but will not change it in the API. If you would like to destroy or reset this resource "+
				"in the API, refer to the documentation for how to do it manually.",
		)
	}
}
