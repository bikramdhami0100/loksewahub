import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";

  try {
    const url = `https://psc.gov.np/front/category/notice-advertisement?page=${page}&&search=${search}&&from_date=&&to_date=`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch PSC notices" }, { status: 500 });
  }
}
