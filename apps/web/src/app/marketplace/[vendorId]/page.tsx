import { VendorDetail } from "./vendor-detail";

// Static export: one shell built with the placeholder "_"; Firebase rewrites /marketplace/<id> to it.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ vendorId: "_" }];
}

export default function Page() {
  return <VendorDetail />;
}
