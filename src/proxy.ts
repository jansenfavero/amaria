import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
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
  matcher: [
    "/entrar",
    "/recuperar-acesso",
    "/definir-senha",
    "/minha-conta/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
