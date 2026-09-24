
import axiosInstance from "../lib/axiosInstance";

export default async function updateProfile({
  imageUrl,
  name,
  bio,
  cookieHeader,
}: {
  imageUrl?: string;
  name?: string | null;
  bio?: string | null;
  cookieHeader?: string;
}) {
  const response = await axiosInstance.post(
    "/user/update-profile",
    {
      image: imageUrl,
      name: name,
      bio: bio,
    },
    {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    }
  );

  return response.data;
}