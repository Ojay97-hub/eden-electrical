import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/** Exits draft mode and returns to the site. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
