import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_AUTH_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://topicloom-api.onrender.com";

/**
 * Catch-all proxy for better-auth.
 * 
 * Browser → /api/auth/* (same origin, no CORS)
 *         → External API (server-to-server, no CORS)
 *         → Forwards cookies back to browser
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const { all } = await params;
  const path = all.join("/");

  // Build the target URL, preserving query string
  const { search } = new URL(request.url);
  const targetUrl = `${EXTERNAL_AUTH_URL}/api/auth/${path}${search}`;

  // Forward request body only for methods that have one
  const hasBody = !["GET", "HEAD"].includes(request.method);

  const proxyResponse = await fetch(targetUrl, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      // Forward cookie header so session checks work
      ...(request.headers.get("cookie")
        ? { cookie: request.headers.get("cookie")! }
        : {}),
      // Tell the external API this request comes from our app
      Origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
    body: hasBody ? await request.text() : undefined,
  });

  const responseText = await proxyResponse.text();

  // Build the Next.js response with the same status
  const response = new NextResponse(responseText, {
    status: proxyResponse.status,
    headers: {
      "Content-Type":
        proxyResponse.headers.get("content-type") || "application/json",
    },
  });

  // ✅ Forward Set-Cookie so the browser stores the session cookie
  const setCookie = proxyResponse.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
