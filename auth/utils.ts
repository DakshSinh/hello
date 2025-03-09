import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cache } from "react";

// Cached function to get session data
export const getSessionData = cache(async () => {
  try {
    const headersList = headers();
    return auth.api.getSession({ headers: await headersList });
  } catch (error) {
    console.error("Error fetching session data:", error);
    return null;
  }
});

// Auth check for server components
export async function requireAuth(redirectPath = "/sign-in") {
  const session = await getSessionData();

  if (!session) {
    try {
      // Safely get the current URL
      const headersList = headers();
      const currentPath = (await headersList).get("x-url") || "";
      
      let callbackUrl = "/";
      if (currentPath && currentPath.startsWith("/")) {
        callbackUrl = encodeURIComponent(currentPath);
      }

      redirect(`${redirectPath}?callbackUrl=${callbackUrl}`);
    } catch (error) {
      console.error("Error in requireAuth:", error);
      redirect(redirectPath);
    }
  }

  return session;
}

// Redirect already authenticated users away from auth pages
export async function redirectIfAuthenticated(redirectPath = "/dashboard") {
  const session = await getSessionData();

  if (session) {
    try {
      const headersList = headers();
      const currentPath = (await headersList).get("x-url") || "";
      const url = new URL(`http://localhost${currentPath}`); // Ensuring valid URL

      const callbackUrl = url.searchParams.get("callbackUrl");
      if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
        redirect(callbackUrl);
      }
    } catch (error) {
      console.error("Error in redirectIfAuthenticated:", error);
    }

    redirect(redirectPath);
  }

  return null;
}
