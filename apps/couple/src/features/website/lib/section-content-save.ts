import { mutate } from "swr";
import { api } from "@/lib/api";
import { SECTIONS_KEY } from "./keys";

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export async function saveContent(sectionId: string, content: Record<string, unknown>) {
  await api.patch(`/couple/api/website/sections/${sectionId}`, { content });
  mutate(SECTIONS_KEY);
}
