import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const contact = await ContactMessage.create({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
    });

    await sendEmail({
      to: process.env.CONTACT_EMAIL || "admin@loksewahub.com",
      subject: `New Contact: ${body.subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
      `,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
