import { NextResponse } from "next/server";
import { getOptionalSupabase } from "@/services/supabase.service";

export async function GET() {
  const supabase = getOptionalSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await (supabase.from("jobs") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
