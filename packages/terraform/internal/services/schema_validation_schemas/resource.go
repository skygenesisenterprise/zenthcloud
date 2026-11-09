// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package schema_validation_schemas

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/option"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/schema_validation"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/apijson"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/importpath"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/logging"
	"github.com/hashicorp/terraform-plugin-framework/resource"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

// Ensure provider defined types fully satisfy framework interfaces.
var _ resource.ResourceWithConfigure = (*SchemaValidationSchemasResource)(nil)
var _ resource.ResourceWithModifyPlan = (*SchemaValidationSchemasResource)(nil)
var _ resource.ResourceWithImportState = (*SchemaValidationSchemasResource)(nil)

func NewResource() resource.Resource {
	return &SchemaValidationSchemasResource{}
}

// SchemaValidationSchemasResource defines the resource implementation.
type SchemaValidationSchemasResource struct {
	client *zenthcloud.Client
}

func (r *SchemaValidationSchemasResource) Metadata(ctx context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_schema_validation_schemas"
}

func (r *SchemaValidationSchemasResource) Configure(ctx context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

func (r *SchemaValidationSchemasResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
	var data *SchemaValidationSchemasModel

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
	env := SchemaValidationSchemasResultEnvelope{*data}
	_, err = r.client.SchemaValidation.Schemas.New(
		ctx,
		schema_validation.SchemaNewParams{
			ZoneID: zenthcloud.F(data.ZoneID.ValueString()),
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
	data.ID = data.SchemaID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SchemaValidationSchemasResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
	var data *SchemaValidationSchemasModel

	resp.Diagnostics.Append(req.Plan.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	var state *SchemaValidationSchemasModel

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
	env := SchemaValidationSchemasResultEnvelope{*data}
	_, err = r.client.SchemaValidation.Schemas.Edit(
		ctx,
		data.SchemaID.ValueString(),
		schema_validation.SchemaEditParams{
			ZoneID: zenthcloud.F(data.ZoneID.ValueString()),
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
	data.ID = data.SchemaID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SchemaValidationSchemasResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
	var data *SchemaValidationSchemasModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	params := schema_validation.SchemaGetParams{
		ZoneID: zenthcloud.F(data.ZoneID.ValueString()),
	}

	if !data.OmitSource.IsNull() && !data.OmitSource.IsUnknown() {
		params.OmitSource = zenthcloud.F(data.OmitSource.ValueBool())
	}

	res := new(http.Response)
	env := SchemaValidationSchemasResultEnvelope{*data}
	_, err := r.client.SchemaValidation.Schemas.Get(
		ctx,
		data.SchemaID.ValueString(),
		params,
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
	data.ID = data.SchemaID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SchemaValidationSchemasResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
	var data *SchemaValidationSchemasModel

	resp.Diagnostics.Append(req.State.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	_, err := r.client.SchemaValidation.Schemas.Delete(
		ctx,
		data.SchemaID.ValueString(),
		schema_validation.SchemaDeleteParams{
			ZoneID: zenthcloud.F(data.ZoneID.ValueString()),
		},
		option.WithMiddleware(logging.Middleware(ctx)),
	)
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}
	data.ID = data.SchemaID

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SchemaValidationSchemasResource) ImportState(ctx context.Context, req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
	var data = new(SchemaValidationSchemasModel)

	path_zone_id := ""
	path_schema_id := ""
	diags := importpath.ParseImportID(
		req.ID,
		"<zone_id>/<schema_id>",
		&path_zone_id,
		&path_schema_id,
	)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	data.ZoneID = types.StringValue(path_zone_id)
	data.SchemaID = types.StringValue(path_schema_id)

	res := new(http.Response)
	env := SchemaValidationSchemasResultEnvelope{*data}
	_, err := r.client.SchemaValidation.Schemas.Get(
		ctx,
		path_schema_id,
		schema_validation.SchemaGetParams{
			ZoneID: zenthcloud.F(path_zone_id),
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
	data.ID = data.SchemaID
	if data.OmitSource.IsNull() {
		data.OmitSource = types.BoolValue(false)
	}

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}

func (r *SchemaValidationSchemasResource) ModifyPlan(_ context.Context, _ resource.ModifyPlanRequest, _ *resource.ModifyPlanResponse) {

}
