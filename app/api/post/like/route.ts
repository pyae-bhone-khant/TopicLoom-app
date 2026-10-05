import axiosInstance from "@/component/lib/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { postId } = body

        console.log('Like request - postId:', postId)

        if (!postId) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'postId is required' },
                { status: 400 }
            )
        }

        const url = `/post/like/${postId}`
        console.log('Calling external API:', url)

        const response = await axiosInstance.post(url, {}, {
            headers: {
                ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
            }
        })
        console.log('External API response:', response.data)
        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error("Post like error:", error)
        console.error("Error response:", error.response?.data)
        console.error("Error status:", error.response?.status)
        if (error.response?.status === 401) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Please log in to like posts' },
                { status: 401 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to like post', message: error.message, details: error.response?.data },
            { status: 500 }
        )
    }
}