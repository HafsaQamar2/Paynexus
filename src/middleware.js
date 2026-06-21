import { NextResponse } from "next/server";

// Guards every /dashboard route. A visitor may enter either with a real
// login session ("pnx_session") or an anonymous demo sandbox
// ("pnx_demo"), which is created by POST /api/auth/demo from the
// landing page's "View Live Demo" button.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const hasSession = request.cookies.has("pnx_session");
    const hasDemo = request.cookies.has("pnx_demo");

    if (!hasSession && !hasDemo) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
