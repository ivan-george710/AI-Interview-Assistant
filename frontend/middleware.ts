import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPages = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublic = publicPages.some(
    (page) =>
      pathname === page ||
      pathname.startsWith(page + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // TEMPORARILY ALLOW ALL ROUTES
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};