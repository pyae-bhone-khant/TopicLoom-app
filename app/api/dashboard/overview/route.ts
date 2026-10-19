import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/component/lib/axiosInstance";

export async function GET(request: NextRequest) {
  try {
    const response = await axiosInstance.get('/user/find-all-data' , {
      headers: {
        "Content-Type": "application/json",
        // Forward cookies from the incoming request
        ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("User find all data fetch error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch user find all data', message: error.message },
      { status: 500 }
    );
  }
}