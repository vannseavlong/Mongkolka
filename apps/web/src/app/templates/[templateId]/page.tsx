import { TemplateDetail } from "./template-detail";

// Static export: one shell built with the placeholder "_"; Firebase rewrites /templates/<id> to it.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ templateId: "_" }];
}

export default function Page() {
  return <TemplateDetail />;
}
