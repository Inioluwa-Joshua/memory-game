import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Exclude static files, Next.js internal files, and API routes
  if (
    pathname.startsWith("/_next") || // Next.js internal files
    pathname.startsWith("/static") || // Static assets
    pathname.startsWith("/api") || // API routes
    pathname.startsWith("/favicon.ico") || // Favicon
    pathname.match(/\.(.*)$/) // Static assets with extensions (e.g., .css, .js)
  ) {
    return NextResponse.next();
  }

  const userId = pathname.split("/")[1];

  if (!userId) {
    // Redirect to invalid-user page if no userId is provided
    url.pathname = "/invalid-user";
    url.searchParams.set("reason", "missing_user_id");
    return NextResponse.rewrite(url);
  }

  try {
    const response = await fetch(`http://localhost:3000/api/player/${userId}`);
    const user = await response.json();

    if (response.ok) {
      return NextResponse.next();
    } else {
      url.pathname = "/invalid-user";
      url.searchParams.set("reason", "user_not_found");
      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error("Error validating user:", error);
    url.pathname = "/invalid-user";
    url.searchParams.set("reason", "server_error");
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: "/:path*", // Apply middleware to all paths
};
