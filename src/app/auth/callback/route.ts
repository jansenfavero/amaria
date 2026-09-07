import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authIsConfigured, getAuthOrigin } from "@/lib/auth/server";

function safeDestination(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/meu-perfil";
  }
  return value.length <= 500 ? value : "/meu-perfil";
}

export async function GET(request: NextRequest) {
  if (!authIsConfigured()) {
    return new NextResponse("O acesso está em configuração.", { status: 503 });
  }
  const origin = getAuthOrigin();
  const code = request.nextUrl.searchParams.get("code");
  const next = safeDestination(request.nextUrl.searchParams.get("next"));
  if (request.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(new URL("/auth/link-invalido", origin));
  }
  if (!code) {
    return NextResponse.redirect(new URL("/auth/receber", origin));
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  } catch {
    // Never log the code, provider payload, cookies or tokens.
  }
  return NextResponse.redirect(new URL("/auth/link-invalido", origin));
}
