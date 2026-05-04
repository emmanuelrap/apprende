// src/hooks/useLevel.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

type Level = { level: number; xp_required: number; title: string };

type LevelInfo = {
  current: Level;
  next: Level | null;
  progress: number; // 0-100
};

export function useLevel(xp: number) {
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    supabase
      .from("levels")
      .select("*")
      .order("level")
      .then(({ data }) => {
        setLevels(data ?? []);
      });
  }, []);

  if (!levels.length) return null;

  const current =
    [...levels].reverse().find((l) => xp >= l.xp_required) ?? levels[0];
  const next = levels.find((l) => l.level === current.level + 1) ?? null;

  const progress = next
    ? Math.round(
        ((xp - current.xp_required) /
          (next.xp_required - current.xp_required)) *
          100,
      )
    : 100;

  return { current, next, progress } as LevelInfo;
}
