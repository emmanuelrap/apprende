// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      setName(profile?.name ?? "");
      setLoading(false);
    };

    load();
  }, []);

  return { user, name, loading };
}
