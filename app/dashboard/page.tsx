"use client";

import axiosInstance from "@/component/lib/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";
import TotalCard from "./components/totalCard";
import TotalUserAndPost from "./components/totalUserandPost";


interface DashboardData {
  editorLength: number;
  userLength: number;
  postLength: number;
  user: {
    id: string;
    name: string;
    image: string | null;
    createdAt: string;
    role: string;
  }[];
  post: {
    title: string;
    createdAt: string;
    author: {
      name: string;
      image: string | null;
    };
  }[];
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
 useEffect(() => {
  const fetchData = async () => {
     const response  = await axiosInstance.get("/api/dashboard/overview");
     console.log(response.data);
     setData(response.data);
  };
  fetchData();
 }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Dashboard Overview</h1>
      
    <TotalCard editorlength={data?.editorLength || 0} userlength={data?.userLength || 0} postlength={data?.postLength || 0} />

    {data && (
      <TotalUserAndPost 
    users={data.user} 
    posts={data.post}
      />
    )}
    </div>
  )
}
