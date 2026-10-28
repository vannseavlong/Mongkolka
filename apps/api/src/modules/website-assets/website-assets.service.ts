import { storageFor } from "../../services/storage/index.js";
import { PublicSiteCache } from "../public-site/public-site.cache.js";
import { createWebsiteAssetsCore } from "./website-assets.core.js";
import { WebsiteAssetsModel } from "./website-assets.model.js";

export const WebsiteAssetsService = createWebsiteAssetsCore({
  model: WebsiteAssetsModel,
  storageFor,
  invalidateCouple: (coupleId) => PublicSiteCache.invalidateCouple(coupleId),
});
