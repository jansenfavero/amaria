import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/proxy";

const CANONICAL_HOST = "amaria.me";
const REDIRECT_HOSTS = new Set(["amar.ia.br", "www.amaria.me"]);
const SESSION_PATHS = [
  "/entrar",
  "/recuperar-acesso",
  "/definir-senha",
  "/minha-conta",
  "/admin",
  "/auth",
];

export async function proxy(request: NextRequest) {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const requestHost = (
    forwardedHost ||
    request.headers.get("host") ||
    request.nextUrl.hostname
  )
    .split(":")[0]
    .toLowerCase();

  if (REDIRECT_HOSTS.has(requestHost)) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = CANONICAL_HOST;
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const needsSession = SESSION_PATHS.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(`${path}/`),
  );

  if (!needsSession) return NextResponse.next();

  try {
    getSupabaseConfig();
  } catch {
    // Pages fail closed and explain configuration errors; the public feed works.
    return NextResponse.next();
  }
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
