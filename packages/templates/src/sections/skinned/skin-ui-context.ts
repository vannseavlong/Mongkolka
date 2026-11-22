"use client";

import { useSkinOrnaments } from "../khmer/skin-context";
import { uiFor } from "./skin-ui";
import type { SkinUi } from "./skin-ui-types";

/** The form/mark side of the active skin, resolved from the same skin context as the ornaments. */
export function useSkinUi(): SkinUi {
  return uiFor(useSkinOrnaments().id);
}
