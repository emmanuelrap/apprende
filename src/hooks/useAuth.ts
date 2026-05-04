import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

type Profile = {
  name: string;
  avatar_url: string | null;
  xp: number;
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, avatar_url, xp")
        .eq("id", user.id)
        .single();

      setProfile(profileData ?? null);
      setLoading(false);
    };

    load();
  }, []);

  return { user, profile, loading };
}
