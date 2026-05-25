export { default }
from "next-auth/middleware";

export const config = {

  matcher: [

    "/",

    "/inventory/:path*",

    "/analytics/:path*",

    "/reservations/:path*",
  ],
};