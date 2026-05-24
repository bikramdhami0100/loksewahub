import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CurrentAffair from "@/models/CurrentAffair";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const category = searchParams.get("category") || "";
    const range = searchParams.get("range") || "";
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = { isPublished: true };
    if (category) filter.category = category;

    const now = new Date();
    if (range === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filter.date = { $gte: start };
    } else if (range === "thisWeek") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filter.date = { $gte: weekAgo };
    } else if (range === "thisMonth") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filter.date = { $gte: monthAgo };
    } else {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      filter.date = { $gte: threeMonthsAgo };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const [articles, total] = await Promise.all([
      CurrentAffair.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      CurrentAffair.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: articles,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/current-affairs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const article = await CurrentAffair.create(body);
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    console.error("POST /api/current-affairs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
