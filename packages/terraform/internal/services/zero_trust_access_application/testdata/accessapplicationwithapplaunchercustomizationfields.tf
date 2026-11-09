resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id            = "%[2]s"
  type                  = "app_launcher"
  session_duration      = "24h"
  app_launcher_logo_url = "https://github.com/skygenesisenterprise/zenthcloud"
  bg_color              = "#000000"
  header_bg_color       = "#000000"

  footer_links = [
    {
      name = "footer link"
      url  = "https://github.com/skygenesisenterprise/zenthcloud"
    }
  ]

  landing_page_design = {
    title             = "title"
    message           = "message"
    button_color      = "#000000"
    image_url         = "https://github.com/skygenesisenterprise/zenthcloud"
    button_text_color = "#000000"
  }
}
