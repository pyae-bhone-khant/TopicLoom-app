import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import updateProfile from "@/component/action/update-profile";

const EXTERNAL_AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "https://topicloom-api.onrender.com";

/** Validate session by forwarding cookies to the NestJS better-auth backend. */
async function getSession(cookieHeader: string) {
  const res = await fetch(`${EXTERNAL_AUTH_URL}/api/auth/get-session`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ user?: { id: string; name: string; email: string; image?: string } } | null>;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // ── 1. Get session from better-auth ─────────────────────────────────────
    const cookieHeader = req.headers.get("cookie") ?? "";
    const session = await getSession(cookieHeader);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    // ── 2. Parse form data ───────────────────────────────────────────────────
    const formData = await req.formData();
    const name   = formData.get("name")   as string | null;
    const bio    = formData.get("bio")    as string | null;
    const avatar = formData.get("avatar") as File   | null;

    // cookieHeader is already declared above

    let imageUrl: string | undefined;

    // ── 3. Handle avatar upload ──────────────────────────────────────────────
    if (avatar && avatar.size > 0) {
      // ၁။ အဟောင်းပုံ Cloudinary မှ ဖျက်ပါ
      if (user.image) {
        const oldPublicId = getPublicIdFromUrl(user.image);
        if (oldPublicId) {
          await cloudinary.uploader.destroy(oldPublicId);
        }
      }

      // ၂။ ပုံသစ် Upload တင်ပါ
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${avatar.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "user_profiles",
      });

      imageUrl = uploadResponse.secure_url;
    }

    // ── 4. Update profile via external API ───────────────────────────────────
    await updateProfile({ imageUrl, bio, name, cookieHeader });

    return NextResponse.json({
      success: true,
      updated: { name, bio, imageUrl: imageUrl ?? null },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[update-profile] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function getPublicIdFromUrl(url: string): string | null {
  if (!url) return null;

  // '/upload/' ရဲ့ အနောက်ပိုင်းကို ယူပါ
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  let path = parts[1];


  path = path.replace(/^v\d+\//, "");

  return path.substring(0, path.lastIndexOf("."));
}