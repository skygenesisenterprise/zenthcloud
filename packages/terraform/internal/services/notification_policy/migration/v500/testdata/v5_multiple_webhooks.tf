resource "zenthcloud_notification_policy_webhooks" "webhook_1" {
  account_id = "%s"
  name       = "tf-test-webhook-1-%s"
  url        = "https://github.com/skygenesisenterprise/zenthcloud"
}

resource "zenthcloud_notification_policy_webhooks" "webhook_2" {
  account_id = "%s"
  name       = "tf-test-webhook-2-%s"
  url        = "https://github.com/skygenesisenterprise/zenthcloud"
}

resource "zenthcloud_notification_policy_webhooks" "webhook_3" {
  account_id = "%s"
  name       = "tf-test-webhook-3-%s"
  url        = "https://github.com/skygenesisenterprise/zenthcloud"
}

resource "zenthcloud_notification_policy" "%s" {
  account_id  = "%s"
  name        = "%s"
  description = "Test notification policy with multiple webhooks"
  enabled     = true
  alert_type  = "universal_ssl_event_type"

  mechanisms = {
    webhooks = [
      {
        id = zenthcloud_notification_policy_webhooks.webhook_1.id
      },
      {
        id = zenthcloud_notification_policy_webhooks.webhook_2.id
      },
      {
        id = zenthcloud_notification_policy_webhooks.webhook_3.id
      }
    ]
  }
}
