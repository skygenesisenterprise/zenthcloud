resource "zenthcloud_workers_script" "%[1]s" {
  account_id  = "%[2]s"
  script_name = "%[1]s"
  content     = "addEventListener('fetch', event => { event.respondWith(new Response('Hello World')); });"
}

resource "zenthcloud_workers_script_subdomain" "%[1]s" {
  account_id  = "%[2]s"
  script_name = zenthcloud_workers_script.%[1]s.script_name
  enabled     = false
}

