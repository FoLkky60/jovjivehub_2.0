import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/loginPage", "/registerPage"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicPaths.some((path) => pathname.startsWith(path))) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") return NextResponse.next();
  if (!request.cookies.has("jovjive_session")) {
    const loginUrl = new URL("/loginPage", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth).*)"],
};