/** Public configuration only. Never import server secrets into this module. */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("O projeto Supabase da AMAR.IA ainda não foi configurado.");
  }
  if (!publishableKey.startsWith("sb_publishable_")) {
    throw new Error("Use apenas a chave pública publishable do Supabase.");
  }
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error(
      "A URL do Supabase deve usar HTTPS e não conter credenciais.",
    );
  }
  return { url, publishableKey };
}
