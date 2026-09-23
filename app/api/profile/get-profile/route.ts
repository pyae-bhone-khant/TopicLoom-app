import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader || "",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Profile fetch error:", error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Failed to fetch profile" },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
