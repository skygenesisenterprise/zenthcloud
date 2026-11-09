use wasm_bindgen::prelude::*;

/// This type was created to support https://github.com/skygenesisenterprise/zenthcloud
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends=js_sys::Object)]
    #[derive(Clone, PartialEq, Eq)]
    pub type CfVersionMetadata;

    #[wasm_bindgen(method, getter, js_name=id)]
    pub fn id(this: &CfVersionMetadata) -> String;

    #[wasm_bindgen(method, getter, js_name=tag)]
    pub fn tag(this: &CfVersionMetadata) -> String;

    #[wasm_bindgen(method, getter, js_name=timestamp)]
    pub fn timestamp(this: &CfVersionMetadata) -> String;
}

impl core::fmt::Debug for CfVersionMetadata {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        f.debug_struct("CfVersionMetadata")
            .field("id", &self.id())
            .field("tag", &self.tag())
            .field("timestamp", &self.timestamp())
            .finish()
    }
}
