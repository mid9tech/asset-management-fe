import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let refreshToken = request.cookies.get("refreshToken");
  const pathname = request.nextUrl.pathname;
  if (pathname === "/") {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
}
export const config = {
  matcher: [
    "/user/:path*",
    "/home/:path*",
    "/assignment/:path*",
    "/asset/:path*",
    "/request-returning/:path*",
    "/report/:path*",
    "/",
  ],
};
