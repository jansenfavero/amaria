export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-7411565684386334";

export const ADSENSE_PUBLISHER_ID = ADSENSE_CLIENT.replace(/^ca-/, "");
