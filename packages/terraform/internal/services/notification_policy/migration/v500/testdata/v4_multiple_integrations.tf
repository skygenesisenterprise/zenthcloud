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

  email_integration {
    id = "test-multi@example.com"
  }

  email_integration {
    id = "test-multi2@example.com"
  }

  webhooks_integration {
    id   = zenthcloud_notification_policy_webhooks.test_webhook.id
    name = zenthcloud_notification_policy_webhooks.test_webhook.name
  }
}
