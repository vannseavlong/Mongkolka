import { mutate } from "swr";
import { api } from "@/lib/api";
import type { SiteLanguage } from "../data/schema";

const SETTINGS_KEY = "/couple/api/website/settings";

/** Saves the language the public site opens in (guests can still switch) and refreshes the settings. */
export async function saveSiteLanguage(language: SiteLanguage): Promise<void> {
  await api.patch("/couple/api/website/language", { language });
  await mutate(SETTINGS_KEY);
}
