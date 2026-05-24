import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await Subscription.findOne({ email: body.email });
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      existing.isActive = true;
      existing.unsubscribeToken = crypto.randomUUID();
      if (body.frequency) existing.frequency = body.frequency;
      if (body.categories) existing.categories = body.categories;
      await existing.save();
      return NextResponse.json(existing);
    }

    const subscription = await Subscription.create({
      email: body.email,
      name: body.name || "",
      frequency: body.frequency || "daily",
      categories: body.categories || [],
      unsubscribeToken: crypto.randomUUID(),
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("POST /api/subscriptions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const filter: Record<string, unknown> = {};
    if (token) filter.unsubscribeToken = token;
    else if (email) filter.email = email;
    else {
      return NextResponse.json({ error: "Token or email required" }, { status: 400 });
    }

    const subscription = await Subscription.findOne(filter);
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    subscription.isActive = false;
    await subscription.save();

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("DELETE /api/subscriptions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
