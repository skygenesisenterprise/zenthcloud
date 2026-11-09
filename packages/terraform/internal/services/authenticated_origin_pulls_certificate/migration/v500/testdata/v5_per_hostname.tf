resource "zenthcloud_authenticated_origin_pulls_hostname_certificate" "%s" {
  zone_id     = "%s"
  certificate = <<-EOT
%s
  EOT
  private_key = <<-EOT
%s
  EOT
}

moved {
  from = zenthcloud_authenticated_origin_pulls_certificate.%s
  to   = zenthcloud_authenticated_origin_pulls_hostname_certificate.%s
}
