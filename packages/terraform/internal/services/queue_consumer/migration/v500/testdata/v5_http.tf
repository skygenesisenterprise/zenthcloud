resource "zenthcloud_queue" "test_queue" {
  account_id = "%[1]s"
  queue_name = "%[2]s"
}

resource "zenthcloud_queue_consumer" "%[2]s" {
  account_id = "%[1]s"
  queue_id   = zenthcloud_queue.test_queue.id
  type       = "http_pull"
}
