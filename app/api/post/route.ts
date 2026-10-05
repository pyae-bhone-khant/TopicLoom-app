import axiosInstance from "@/component/lib/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const response = await axiosInstance.get('/post', {
             headers: {
          ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
        }
        })
        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error("Post fetch error:", error)
        if (error.response?.status === 401) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Please log in to view posts' },
                { status: 401 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to fetch posts', message: error.message },
            { status: 500 }
        )
    }
}