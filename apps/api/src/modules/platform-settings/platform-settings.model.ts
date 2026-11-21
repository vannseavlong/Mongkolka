import { adminContext } from "../../config/database.js";

export const PlatformSettingsModel = {
  async get(key: string): Promise<string | null> {
    const row = (await adminContext().table("platform_settings").findOne({ where: { setting_key: key } })) as {
      value?: unknown;
    } | null;
    return row && typeof row.value === "string" ? row.value : null;
  },

  async set(key: string, value: string): Promise<void> {
    const table = adminContext().table("platform_settings");
    const existing = await table.findOne({ where: { setting_key: key } });
    if (existing) await table.update({ where: { setting_key: key }, data: { value } });
    else await table.create({ setting_key: key, value });
  },
};
