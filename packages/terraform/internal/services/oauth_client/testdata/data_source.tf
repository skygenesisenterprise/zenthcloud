resource "zenthcloud_oauth_client" "%[1]s" {
  account_id = "%[2]s"
  client_name = "%[1]s"
  grant_types = ["authorization_code"]
  redirect_uris = ["https://example.com/callback"]
  response_types = ["code"]
  scopes = ["user-details.read", "teams.read"]
  token_endpoint_auth_method = "none"
}

data "zenthcloud_oauth_client" "%[1]s" {
  account_id = "%[2]s"
  oauth_client_id = zenthcloud_oauth_client.%[1]s.client_id
}

data "zenthcloud_oauth_clients" "%[1]s" {
  account_id = "%[2]s"
  depends_on = [zenthcloud_oauth_client.%[1]s]
}
