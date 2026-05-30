import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "20";
  const postType = searchParams.get("post_type") || "";
  const searchQuery = searchParams.get("q") || "";

  try {
    const url = `https://www.nrb.org.np/api/app/v1/posts?page=${page}&per_page=${perPage}&post_type=${postType}&q=${searchQuery}&order_by=post_date&order=DESC`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch NRB posts" }, { status: 500 });
  }
}
