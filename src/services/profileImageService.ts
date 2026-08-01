import { ApiResponse } from "../types/api.types";
import { User } from "../slices/auth/auth.types";
import { api } from "../api/axios";

function guessMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export async function uploadAvatar(fileUri: string): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", {
    uri: fileUri,
    name: "avatar.jpg",
    type: guessMimeType(fileUri),
  } as unknown as Blob);

  const { data } = await api.post<
    ApiResponse<{ user: User; profile_picture: string }>
  >("/users/me/avatar", formData);

  if (!data.success || !data.data?.profile_picture) {
    throw new Error("Failed to upload profile photo");
  }

  return data.data.profile_picture;
}
