import { createClient } from "@supabase/supabase-js";
import { AppError } from "../utils/appError";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const bucketName = process.env.SUPABASE_BUCKET_NAME as string;

export async function uploadProfilePhoto(folder_name: string, file: Express.Multer.File): Promise<string> {
  if (!file) throw AppError("No file uploaded", 400);

  const filePath = `${folder_name}/${Date.now()}_${file.originalname}`;
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw AppError("Failed to upload photo to Supabase", 500, error);

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  if (!data.publicUrl) throw AppError("Failed to get public URL from Supabase", 500);

  return data.publicUrl;
}