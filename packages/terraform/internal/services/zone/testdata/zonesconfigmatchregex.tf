
data "zenthcloud_zones" "%[2]s" {
  filter {
    match  = "baa-*"
    // This is an ordering fix to ensure that the test suite doesn't assert
    // state before all the resources are available.
    paused = "${zenthcloud_zone.foo_net.paused}"
  }
}

%[1]s
