import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  try {
    // Properly verify the session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If no valid session
    if (!session) {
      // Store the intended URL to redirect back after login
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.url)
      );
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    // On error, redirect to sign-in for safety
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/protected-route"],
};