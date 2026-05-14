import { type NextRequest, NextResponse } from "next/server";

// Simplified middleware — no auth protection for demo mode.
// Supabase session refresh is retained for any optional DB operations.
export const updateSession = async (request: NextRequest) => {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
};