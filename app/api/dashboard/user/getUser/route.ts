import axiosInstance from "@/component/lib/axiosInstance";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   const response = await  axiosInstance.get("/user/All-user" , { 
    headers: {
        ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie') } : {})
    }
   });
   return Response.json(response.data);
}