import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/component/lib/axiosInstance";
import axios from "axios";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { role } = body;

    console.log("PATCH /api/users/[userId]/role - userId:", userId, "role:", role);

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    const cookie = request.headers.get('cookie');
    console.log("Cookie from request:", cookie ? "Present" : "Missing");

    const response = await axiosInstance.patch(`/user/change-user-role/${userId}`,
      { role },
      {
        headers: {
          ...(cookie ? { cookie } : {})
        }
      }
    );

    console.log("Backend response:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error updating user role:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response?.data);
      console.error("Axios error status:", error.response?.status);
      console.error("Axios error headers:", error.response?.headers);
    }
    return NextResponse.json(
      { error: "Failed to update user role", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
