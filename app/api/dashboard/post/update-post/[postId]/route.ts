import axiosInstance from "@/component/lib/axiosInstance";
import { NextRequest } from "next/server";
import axios from "axios";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const body = await request.json();
    
    console.log("PATCH /api/dashboard/post/update-post/[postId] - postId:", postId, "body:", body);

    const response = await axiosInstance.post(`/post/update-post/${postId}`, body, {
      headers: {
        ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
      }
    });
    
    console.log("Backend response:", response.data);
    return Response.json(response.data);
  } catch (error) {
    console.error("Error updating post:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response?.data);
      console.error("Axios error status:", error.response?.status);
    }
    return Response.json(
      { error: "Failed to update post", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
