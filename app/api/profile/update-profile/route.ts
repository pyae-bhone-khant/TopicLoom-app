import { NextRequest, NextResponse } from "next/server";

import { v2 as cloudinary } from 'cloudinary';
import updateProfile from "@/component/action/update-profile";

// Cloudinary Credentials တွေကို .env ထဲမှာ ထည့်ထားပါ
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const bio = formData.get("bio") as string | null;
    const avatar = formData.get("avatar") as File | null;

    // Forward the browser's session cookie to the external API
    const cookieHeader = req.headers.get("cookie") ?? "";

    let imageUrl: string | undefined;

    // Avatar ရှိပြီး file size > 0 ဖြစ်မှ Cloudinary သို့ upload လုပ်မည်
    if (avatar && avatar.size > 0) {
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${avatar.type};base64,${buffer.toString('base64')}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: 'user_profiles',
      });
      imageUrl = uploadResponse.secure_url;
    }

    await updateProfile({ imageUrl, bio, name, cookieHeader });

    return NextResponse.json({
      success: true,
      updated: { name, bio, hasAvatar: !!avatar },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[update-profile] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
