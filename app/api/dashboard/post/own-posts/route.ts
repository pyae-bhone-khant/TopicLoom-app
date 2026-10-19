import axiosInstance from "@/component/lib/axiosInstance";
import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/dashboard/post/own-posts - fetching own posts");
    const response = await axiosInstance.get("/post/own-posts", {
      headers: {
        ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
      }
    });
    console.log("Backend own posts response:", response.data);
    return Response.json(response.data);
  } catch (error) {
    console.error("Error fetching own posts:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response?.data);
      console.error("Axios error status:", error.response?.status);
    }
    return Response.json(
      { error: "Failed to fetch own posts", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
