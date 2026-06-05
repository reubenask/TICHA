import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { z } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../http/httpError.js";

const uploadRequestSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  contentType: z.string().trim().min(3).max(120).optional(),
  folder: z.enum(["profile-photos", "captures"]).default("profile-photos")
});

const supabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

function extensionFromFileName(fileName: string) {
  const match = fileName.match(/\.([a-z0-9]+)$/i);
  return match ? `.${match[1].toLowerCase()}` : "";
}

export async function createUploadTarget(userId: string, input: unknown) {
  const data = uploadRequestSchema.parse(input);
  const extension = extensionFromFileName(data.fileName);
  const path = `${data.folder}/${userId}/${nanoid(16)}${extension}`;

  if (env.STORAGE_PROVIDER === "local") {
    return {
      provider: "local",
      path,
      uploadUrl: null,
      publicUrl: null,
      message: "Local storage mode is active. Configure STORAGE_PROVIDER=supabase for signed upload URLs."
    };
  }

  if (!supabase) {
    throw new HttpError(500, "Supabase storage is not configured.", "STORAGE_NOT_CONFIGURED");
  }

  const { data: signedUpload, error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !signedUpload) {
    throw new HttpError(500, error?.message || "Could not create upload URL.", "UPLOAD_URL_FAILED");
  }

  const { data: publicData } = supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(path);

  return {
    provider: "supabase",
    path,
    uploadUrl: signedUpload.signedUrl,
    token: signedUpload.token,
    publicUrl: publicData.publicUrl,
    contentType: data.contentType
  };
}
