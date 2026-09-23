import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call the external better-auth API from the server
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/sign-in/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward the origin so the external API sets cookies with the right domain
          Origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: data.message || "Invalid credentials" },
        { status: authResponse.status }
      );
    }

    // Build the success response
    const response = NextResponse.json(
      { success: true, user: data.user },
      { status: 200 }
    );

    // ✅ Forward ALL Set-Cookie headers from the external API to the browser.
    // This is the critical step — without it, useSession() never sees a session.
    const setCookieHeader = authResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
