import { supabase } from "./supabaseClient";
import { env } from "../utils/env";

function getAvatarPath(userId: string) {
  return `${userId}/avatar.jpg`;
}

export function getStoragePathFromPublicUrl(url?: string | null): string | null {
  if (!url || !env.supabaseUrl || !env.supabaseAvatarBucket) return null;

  const marker = `/storage/v1/object/public/${env.supabaseAvatarBucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  return decodeURIComponent(url.slice(idx + marker.length).split("?")[0] ?? "");
}

async function removeStorageObject(path: string) {
  if (!supabase || !env.supabaseAvatarBucket) return;

  const { error } = await supabase.storage
    .from(env.supabaseAvatarBucket)
    .remove([path]);

  if (error && !error.message?.toLowerCase().includes("not found")) {
    throw error;
  }
}

export async function uploadAvatar(
  userId: string,
  fileUri: string,
  previousUrl?: string | null,
): Promise<string> {
  if (!supabase || !env.supabaseAvatarBucket) {
    throw new Error("Supabase storage is not configured.");
  }

  const path = getAvatarPath(userId);
  const previousPath = getStoragePathFromPublicUrl(previousUrl);

  if (previousPath && previousPath !== path) {
    await removeStorageObject(previousPath);
  } else if (previousPath === path) {
    await removeStorageObject(path);
  }

  const response = await fetch(fileUri);
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("Content-Type") ?? "image/jpeg";

  const { error: uploadError } = await supabase.storage
    .from(env.supabaseAvatarBucket)
    .upload(path, arrayBuffer, {
      upsert: true,
      contentType,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(env.supabaseAvatarBucket)
    .getPublicUrl(path);

  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function deleteUploadedAvatar(publicUrl: string) {
  const path = getStoragePathFromPublicUrl(publicUrl);
  if (!path) return;
  await removeStorageObject(path);
}
