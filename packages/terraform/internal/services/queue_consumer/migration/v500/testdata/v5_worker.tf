resource "zenthcloud_queue" "test_queue" {
  account_id = "%[1]s"
  queue_name = "%[2]s"
}

resource "zenthcloud_workers_script" "worker_script" {
  account_id  = "%[1]s"
  script_name = "%[2]s"
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
  depends_on  = [zenthcloud_queue.test_queue]
}

resource "zenthcloud_queue_consumer" "%[2]s" {
  account_id  = "%[1]s"
  queue_id    = zenthcloud_queue.test_queue.id
  type        = "worker"
  script_name = zenthcloud_workers_script.worker_script.script_name
  depends_on  = [zenthcloud_workers_script.worker_script]
}
