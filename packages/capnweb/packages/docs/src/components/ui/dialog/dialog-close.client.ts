import { mount } from "@zenthcloud/nimbus-docs/client";

mount("[data-dialog-close]", (btn) => {
  const close = () => btn.closest("dialog")?.close();
  btn.addEventListener("click", close);
  return () => btn.removeEventListener("click", close);
});
