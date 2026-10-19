import DashboardNavbar from "./components/DashboardNavbar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check user role
  let userRole = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        cookie: (await headers()).get('cookie') || '',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      userRole = data?.role;
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }

  // Redirect non-admin and non-editor users
  if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <DashboardNavbar />
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
