resource "zenthcloud_queue" "test_queue" {
  account_id = "%[1]s"
  queue_name = "%[2]s"
}

resource "zenthcloud_queue" "dlq1" {
  account_id = "%[3]s"
  queue_name = "%[4]s"
}

resource "zenthcloud_queue" "dlq2" {
  account_id = "%[5]s"
  queue_name = "%[6]s"
}

resource "zenthcloud_queue_consumer" "%[7]s" {
  account_id        = "%[8]s"
  queue_id          = zenthcloud_queue.test_queue.id
  type              = "http_pull"
  dead_letter_queue = zenthcloud_queue.dlq2.queue_name
  settings = {
    batch_size            = 10
    max_retries           = 3
    retry_delay           = 0
    visibility_timeout_ms = 30000
  }
}
