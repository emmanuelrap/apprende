import { supabase } from "./supabase";
// =====================
// 🗑 DELETE USER
// =====================

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  if (error) throw error;
}
