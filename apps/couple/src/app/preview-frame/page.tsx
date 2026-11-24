import { PreviewFrame } from "@/features/website/preview/preview-frame";

// Loaded inside the builder's preview iframe, so the site is laid out in a real
// device-sized viewport (vh, svh and breakpoints all behave like on the public site).
export default function Page() {
  return <PreviewFrame />;
}
