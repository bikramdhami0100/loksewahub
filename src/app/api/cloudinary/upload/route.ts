import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { uploadFile } from "@/lib/cloudinary";
import FileAsset from "@/models/FileAsset";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "loksewahub/general";

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploadResult = await uploadFile(dataUri, folder);

    const fileAsset = await FileAsset.create({
      publicId: uploadResult.publicId,
      secureUrl: uploadResult.secureUrl,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      folder: uploadResult.folder,
      originalName: file.name,
      uploadedBy: session.user.id,
    });

    return NextResponse.json(fileAsset, { status: 201 });
  } catch (error) {
    console.error("POST /api/cloudinary/upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
