import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VISITOR_COOKIE = "amaria_visitor";
const EVENT_NAMES = new Set(["page_view", "article_view", "article_share"]);

function getVisitorId(request: NextRequest) {
  const current = request.cookies.get(VISITOR_COOKIE)?.value;
  return current && /^[0-9a-f-]{36}$/i.test(current)
    ? current
    : crypto.randomUUID();
}

function json(
  request: NextRequest,
  visitorId: string,
  data: unknown,
  status = 200,
) {
  const response = NextResponse.json(data, { status });
  if (!request.cookies.has(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  const visitorId = getVisitorId(request);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_article_like_state", {
    p_visitor_id: visitorId,
    p_article_slug: slug,
  });
  return error
    ? json(request, visitorId, { error: "unavailable" }, 503)
    : json(request, visitorId, data ?? { liked: false, count: 0 });
}

export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    eventName?: string;
    path?: string;
    slug?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const visitorId = getVisitorId(request);
  const supabase = await createClient();

  if (body.action === "toggle_like") {
    const slug = body.slug ?? "";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return json(request, visitorId, { error: "invalid slug" }, 400);
    }
    const { data, error } = await supabase.rpc("toggle_article_like", {
      p_visitor_id: visitorId,
      p_article_slug: slug,
    });
    return error
      ? json(request, visitorId, { error: "unavailable" }, 503)
      : json(request, visitorId, data ?? { liked: false, count: 0 });
  }

  const eventName = body.eventName ?? "";
  const path = body.path ?? "";
  const slug = body.slug ?? null;
  if (
    !EVENT_NAMES.has(eventName) ||
    !path.startsWith("/") ||
    path.length > 500 ||
    (slug !== null && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
  ) {
    return json(request, visitorId, { error: "invalid event" }, 400);
  }

  const { error } = await supabase.rpc("record_content_event", {
    p_visitor_id: visitorId,
    p_event_name: eventName,
    p_event_path: path,
    p_article_slug: slug,
  });
  return error
    ? json(request, visitorId, { error: "unavailable" }, 503)
    : json(request, visitorId, { ok: true });
}

