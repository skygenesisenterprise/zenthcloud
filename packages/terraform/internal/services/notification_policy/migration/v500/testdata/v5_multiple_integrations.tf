resource "zenthcloud_notification_policy_webhooks" "test_webhook" {
  account_id = "%s"
  name       = "tf-test-webhook-%s"
  url        = "https://github.com/skygenesisenterprise/zenthcloud"
}

resource "zenthcloud_notification_policy" "%s" {
  account_id  = "%s"
  name        = "%s"
  description = "Test notification policy with multiple integrations"
  enabled     = true
  alert_type  = "expiring_service_token_alert"

  mechanisms = {
    email = [
      {
        id = "test-multi@example.com"
      },
      {
        id = "test-multi2@example.com"
      }
    ]
    webhooks = [{
      id = zenthcloud_notification_policy_webhooks.test_webhook.id
    }]
  }
}
