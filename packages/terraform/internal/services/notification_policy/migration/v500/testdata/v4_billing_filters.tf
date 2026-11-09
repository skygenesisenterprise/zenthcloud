resource "zenthcloud_notification_policy_webhooks" "test_webhook" {
  account_id = "%s"
  name       = "tf-test-webhook-%s"
  url        = "https://github.com/skygenesisenterprise/zenthcloud"
}

resource "zenthcloud_notification_policy" "%s" {
  account_id  = "%s"
  name        = "%s"
  description = "Test notification policy with filters"
  enabled     = true
  alert_type  = "billing_usage_alert"

  filters {
    product = ["worker_requests"]
    limit   = ["100"]
  }

  webhooks_integration {
    id   = zenthcloud_notification_policy_webhooks.test_webhook.id
    name = zenthcloud_notification_policy_webhooks.test_webhook.name
  }
}
