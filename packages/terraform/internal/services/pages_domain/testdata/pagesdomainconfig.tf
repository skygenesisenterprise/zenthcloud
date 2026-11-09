
		resource "zenthcloud_pages_project" "%[1]s" {
			account_id = "%[2]s"
			name = "%[3]s"
			production_branch = "main"
		}
		resource "zenthcloud_pages_domain" "%[1]s" {
		  account_id = "%[2]s"
		  project_name = zenthcloud_pages_project.%[1]s.name
		  name = "%[4]s"
		}
		