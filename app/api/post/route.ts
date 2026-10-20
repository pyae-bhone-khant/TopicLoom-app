import axiosInstance from "@/component/lib/axiosInstance";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const response = await axiosInstance.get('/post', {
             headers: {
          ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
        }
        })
        return NextResponse.json(response.data)
    } catch (error) {
        console.error("Post fetch error:", error)

        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Please log in to view posts' },
                { status: 401 }
            )
        }

        if (axios.isAxiosError(error) && !error.response) {
            return NextResponse.json(
                {
                    error: 'Posts service unavailable',
                    message: 'The posts service is temporarily unavailable. Please try again later.',
                },
                { status: 503 }
            )
        }

        return NextResponse.json(
            {
                error: 'Failed to fetch posts',
                message: 'The posts service returned an error. Please try again later.',
            },
            { status: 502 }
        )
    }
}