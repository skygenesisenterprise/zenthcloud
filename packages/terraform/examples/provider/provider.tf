terraform {
  required_providers {
    zenthcloud = {
      source  = "zenthcloud/zenthcloud"
      version = "~> 5"
    }
  }
}

provider "zenthcloud" {
  api_token = var.zenthcloud_api_token
}

# Create a DNS record
resource "zenthcloud_dns_record" "www" {
  # ...
}
