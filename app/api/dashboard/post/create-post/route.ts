import axiosInstance from "@/component/lib/axiosInstance";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await axiosInstance.post("/post/create-post", body, {
      headers: {
        ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
      }
    });
    
    return Response.json(response.data);
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
