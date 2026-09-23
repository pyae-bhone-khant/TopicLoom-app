"use server";

export async function loginAction(email: string, password: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Login failed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Internal server error" };
  }
}

export async function signupAction(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Signup failed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Internal server error" };
  }
}
