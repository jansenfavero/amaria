import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { safeAuthDestination } from "@/lib/auth/policy";
import { authIsConfigured, getAuthOrigin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

const supportedTypes = new Set([
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
]);

export async function GET(request: NextRequest) {
  if (!authIsConfigured()) {
    return new NextResponse("O acesso está em configuração.", { status: 503 });
  }

  const origin = getAuthOrigin();
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const next = safeAuthDestination(request.nextUrl.searchParams.get("next"));

  if (!tokenHash || !type || !supportedTypes.has(type)) {
    return NextResponse.redirect(new URL("/auth/link-invalido", origin));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });

    if (
      !error &&
      data.user?.email_confirmed_at &&
      data.user.is_anonymous !== true
    ) {
      if (type === "recovery") {
        return NextResponse.redirect(new URL(next, origin));
      }
      const confirmed = new URL("/auth/confirmado", origin);
      confirmed.searchParams.set("next", next);
      return NextResponse.redirect(confirmed);
    }
  } catch {
    // Tokens and provider payloads are intentionally never logged.
  }

  return NextResponse.redirect(new URL("/auth/link-invalido", origin));
}
