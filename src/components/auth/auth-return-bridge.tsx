"use client";

import { useEffect } from "react";

/** Default Supabase invitation templates can return a fragment to Site URL. */
export function AuthReturnBridge() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/auth/")) return;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (
      hash.has("access_token") ||
      hash.has("refresh_token") ||
      hash.has("error_code")
    ) {
      window.location.replace(`/auth/receber${window.location.hash}`);
    }
  }, []);
  return null;
}
