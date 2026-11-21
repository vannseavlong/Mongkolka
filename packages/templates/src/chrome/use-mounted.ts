"use client";

import { useEffect, useState } from "react";

/** False on the server and the first client render, so server and client markup match. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
