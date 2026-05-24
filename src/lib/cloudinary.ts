import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const FOLDERS = {
  notes: "loksewahub/notes",
  syllabus: "loksewahub/syllabus",
  oldQuestions: "loksewahub/old-questions",
  currentAffairs: "loksewahub/current-affairs",
  notices: "loksewahub/notices",
  users: "loksewahub/users",
  mockTests: "loksewahub/mock-tests",
  reports: "loksewahub/reports",
} as const;

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  format: string;
  bytes: number;
  folder: string;
  uploadedAt: Date;
}

export async function uploadFile(
  file: string,
  folder: string,
  options?: {
    resourceType?: "auto" | "image" | "raw" | "video";
    publicId?: string;
  }
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: options?.resourceType ?? "auto",
    public_id: options?.publicId,
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    format: result.format,
    bytes: result.bytes,
    folder: result.folder,
    uploadedAt: new Date(),
  };
}

export async function deleteFile(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function getFileUrl(publicId: string): Promise<string> {
  return cloudinary.url(publicId, { secure: true });
}

export default cloudinary;
