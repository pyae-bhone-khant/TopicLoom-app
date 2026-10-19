"use client"

import axiosInstance from "@/component/lib/axiosInstance";
import { useEffect, useState } from "react";
import AllUserCard from "../components/AllUserCard";
 interface userdata { 
    id: string;
    name: string;
    email: string;
    role: string; 
    image : string;
    bio : string | null ; 
 }

 interface UserResponse {
    users: userdata[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
 }

export default function UserPage() {
    const [data , setData] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/api/dashboard/user/getUser");
                console.log("API Response:", response.data);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

    }, []);
    return (
        <div>
        {loading ? (
            <p className="text-slate-400">Loading users...</p>
        ) : data?.users ? (
          <AllUserCard u={data.users} uLength={data.meta.total} />
        ) : (
            <p className="text-slate-400">No users found or error loading data</p>
        )}
        </div>
    )              
}  