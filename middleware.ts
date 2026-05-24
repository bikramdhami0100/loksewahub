import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ne"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    locales.some((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
  ) {
    return;
  }

  if (
    pathname === "/" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    /\.[\w]+$/.test(pathname)
  ) {
    return;
  }

  const url = new URL(`/${defaultLocale}${pathname}`, request.url);
  url.search = request.nextUrl.search;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
