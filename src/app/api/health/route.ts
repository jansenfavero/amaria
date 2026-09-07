export const dynamic = "force-dynamic";

/** Liveness only; does not imply that future database/AI integrations are ready. */
export function GET() {
  return Response.json(
    { status: "ok", service: "amaria", phase: "2b-member-platform" },
    {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    },
  );
}
