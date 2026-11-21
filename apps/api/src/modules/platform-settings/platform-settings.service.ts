import { ASSET_LIMITS } from "../website-assets/website-assets.limits.js";
import { createPlatformSettingsCore } from "./platform-settings.core.js";
import { PlatformSettingsModel } from "./platform-settings.model.js";

export const PlatformSettingsService = createPlatformSettingsCore({
  store: PlatformSettingsModel,
  defaults: ASSET_LIMITS,
});
