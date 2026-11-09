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

resource "zenthcloud_workers_script" "worker_script_with_dead_letter" {
  account_id  = "%[9]s"
  script_name = "test-worker-consumer-worker-with-dead-letter-script"
  bindings = [
    {
      type       = "queue"
      name       = "incoming"
      queue_name = zenthcloud_queue.test_queue.queue_name
    }
  ]
  content     = <<-EOT
export default {
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      console.log('Received', message);
    }
  }
};
EOT
  main_module = "index.js"

  depends_on = [zenthcloud_queue.test_queue]
}

resource "zenthcloud_queue_consumer" "%[7]s" {
  account_id        = "%[8]s"
  queue_id          = zenthcloud_queue.test_queue.id
  type              = "worker"
  script_name       = zenthcloud_workers_script.worker_script_with_dead_letter.script_name
  dead_letter_queue = zenthcloud_queue.dlq2.queue_name

  depends_on = [zenthcloud_workers_script.worker_script_with_dead_letter, zenthcloud_queue.test_queue]
}
