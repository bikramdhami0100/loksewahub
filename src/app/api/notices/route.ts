import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notice from "@/models/Notice";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const source = searchParams.get("source") || "";

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ];
    }

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .sort({ publishedDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Notice.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: notices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/notices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const notice = await Notice.create(body);
    return NextResponse.json({ data: notice }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
