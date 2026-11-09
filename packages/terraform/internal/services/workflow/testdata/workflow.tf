resource "zenthcloud_worker" "workflow_worker" {
    account_id  = "%[2]s"
    name        = "%[4]s"
}

resource "zenthcloud_worker_version" "workflow_version" {
    account_id  = "%[2]s"
    worker_id = zenthcloud_worker.workflow_worker.id
    compatibility_date = "2024-11-13"
    main_module = "worker.js"
    modules = [{
        content_file = "%[6]s"
        content_type = "application/javascript+module"
        name = "worker.js"
    }]
    depends_on = [
        zenthcloud_worker.workflow_worker
    ]
}

resource "zenthcloud_workers_deployment" "workflow_deployment" {
  account_id = "%[2]s"
  script_name = zenthcloud_worker.workflow_worker.name
  strategy = "percentage"
  versions = [{
    percentage = 100
    version_id = zenthcloud_worker_version.workflow_version.id
  }]
  depends_on = [
    zenthcloud_worker_version.workflow_version
  ]
}

resource "zenthcloud_workflow" "%[1]s" {
   account_id    = "%[2]s"
   workflow_name = "%[3]s"
   script_name   = zenthcloud_worker.workflow_worker.name
   class_name    = "%[5]s"
   depends_on = [
      zenthcloud_workers_deployment.workflow_deployment,
   ]
 }
