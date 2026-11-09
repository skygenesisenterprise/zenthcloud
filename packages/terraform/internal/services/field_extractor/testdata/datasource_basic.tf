resource "zenthcloud_field_extractor" "source" {
  account_id = "%[1]s"
  extractor  = "llm_prompts"
  rules = [{
    ref         = "chat-completions"
    description = "Extract prompts from chat completion requests"
    fields = [{
      name       = "prompt"
      expression = "filter(http.request.body.json.strings.values, http.request.body.json.strings.pointers[*] matches \"^/messages/\\\\d+/content$\")"
    }]
  }]
}

data "zenthcloud_field_extractor" "test" {
  account_id = "%[1]s"
  extractor  = "llm_prompts"

  depends_on = [zenthcloud_field_extractor.source]
}
