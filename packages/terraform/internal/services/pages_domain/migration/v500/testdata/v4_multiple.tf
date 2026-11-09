resource "zenthcloud_pages_project" "%[1]s_%[2]s" {
  account_id        = "%[3]s"
  name              = "%[4]s"
  production_branch = "main"
}

resource "zenthcloud_pages_domain" "%[1]s_domain1" {
  account_id   = "%[3]s"
  project_name = zenthcloud_pages_project.%[1]s_%[2]s.name
  domain       = "%[5]s"
}

resource "zenthcloud_pages_domain" "%[1]s_domain2" {
  account_id   = "%[3]s"
  project_name = zenthcloud_pages_project.%[1]s_%[2]s.name
  domain       = "%[6]s"
}
