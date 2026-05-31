import { useProfileBootstrap } from "@/src/hooks/useProfileBootstrap";
import { TrophyUnlockedScreen } from "@/src/screens/TrophyUnlockedScreen";
import { useAuthStore } from "@/src/store/authStore";
import { useGamificationStore } from "@/src/store/gamificationStore";
import { useReadingStore } from "@/src/store/readingStore";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEAL = "#078F83";
const TEAL_LIGHT = "#E1F5EE";
const BG = "#F4F6F8";

const LEVELS = [
  { label: "Principiante", sub: "A1 - A2", minXp: 0 },
  { label: "Intermedio", sub: "B1 - B2", minXp: 500 },
  { label: "Avanzado", sub: "C1 - C2", minXp: 2000 },
  { label: "Experto", sub: "C2+", minXp: 5000 },
];

function getCurrentLevel(xp: number) {
  let idx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) { idx = i; break; }
  }
  return { ...LEVELS[idx], index: idx };
}

function getProgress(xp: number) {
  const current = getCurrentLevel(xp);
  const nextLevel = LEVELS[current.index + 1];
  if (!nextLevel) return { current, next: null, progress: 100, xpNeeded: 0 };
  const total = nextLevel.minXp - current.minXp;
  const earned = xp - current.minXp;
  const progress = Math.min((earned / total) * 100, 100);
  return { current, next: nextLevel, progress, xpNeeded: nextLevel.minXp - xp };
}

function Avatar({ name }: { name: string }) {
  const initial = name?.charAt(0).toUpperCase() ?? "?";
  return (
    <View style={{ alignItems: "center", marginBottom: 12 }}>
      <View style={{
        width: 110, height: 110, borderRadius: 55,
        borderWidth: 4, borderColor: TEAL_LIGHT,
        justifyContent: "center", alignItems: "center",
        backgroundColor: "#fff",
      }}>
        <View style={{
          width: 94, height: 94, borderRadius: 47,
          borderWidth: 3, borderColor: TEAL,
          backgroundColor: TEAL,
          justifyContent: "center", alignItems: "center",
        }}>
          <Text style={{ fontSize: 42, fontWeight: "900", color: "#fff" }}>{initial}</Text>
        </View>
      </View>
    </View>
  );
}

function ProgressPath({ xp }: { xp: number }) {
  const { current, next, progress, xpNeeded } = getProgress(xp);

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#1C1C1E", marginBottom: 12 }}>
        Camino de Progreso
      </Text>

      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        {LEVELS.map((level, i) => {
          const isCurrent = i === current.index;
          const isPassed = i < current.index;
          const isLast = i === LEVELS.length - 1;

          let fillPercent = 0;
          if (isPassed) fillPercent = 100;
          else if (isCurrent) fillPercent = progress;

          return (
            <View key={level.label} style={{ alignItems: "center", flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                <View style={{
                  width: 48, height: 48, borderRadius: 24,
                  borderWidth: isCurrent ? 3 : 2,
                  borderColor: (isCurrent || isPassed) ? TEAL : "#CBD5E1",
                  backgroundColor: (isCurrent || isPassed) ? "#fff" : "#F1F5F9",
                  justifyContent: "center", alignItems: "center",
                  alignSelf: "center",
                }}>
                  <Text style={{ fontSize: 18, opacity: (isCurrent || isPassed) ? 1 : 0.4 }}>
                    {isPassed ? "📚" : isCurrent ? "📖" : "🔒"}
                  </Text>
                </View>

                {!isLast && (
                  <View style={{ flex: 1, height: 4, marginTop: -2, backgroundColor: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                    <View style={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: fillPercent > 0 ? TEAL : "#E2E8F0",
                      width: `${fillPercent}%`,
                    }} />
                  </View>
                )}
              </View>

              <Text style={{
                fontSize: 10, fontWeight: isCurrent ? "800" : "600",
                color: (isCurrent || isPassed) ? "#1C1C1E" : "#94A3B8",
                marginTop: 6, textAlign: "center",
              }}>
                {level.label}
              </Text>
              <Text style={{ fontSize: 9, color: "#94A3B8", textAlign: "center" }}>
                {level.sub}
              </Text>
            </View>
          );
        })}
      </View>

      {next && (
        <View style={{
          marginTop: 14,
          backgroundColor: TEAL_LIGHT,
          borderRadius: 12,
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 12, color: TEAL, fontWeight: "600" }}>
              Te faltan <Text style={{ fontWeight: "900" }}>{xpNeeded} XP</Text> para {next.label}
            </Text>
            <View style={{
              height: 5,
              backgroundColor: "rgba(7,143,131,0.15)",
              borderRadius: 4,
              marginTop: 6,
              overflow: "hidden",
            }}>
              <View style={{
                height: 5,
                borderRadius: 4,
                backgroundColor: TEAL,
                width: `${progress}%`,
              }} />
            </View>
          </View>
          <Text style={{ fontSize: 14, fontWeight: "800", color: TEAL }}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}

      {!next && (
        <View style={{
          marginTop: 14,
          backgroundColor: "#F0FDF4",
          borderRadius: 12,
          padding: 12,
          alignItems: "center",
        }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#16A34A" }}>
            🎉 ¡Has alcanzado el nivel máximo!
          </Text>
        </View>
      )}
    </View>
  );
}

function StatCard({ icon, value, label, sub }: any) {
  return (
    <View style={{
      flex: 1, backgroundColor: "#fff", borderRadius: 16,
      padding: 14, alignItems: "center",
      shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}>
      <Text style={{ fontSize: 22, marginBottom: 4 }}>{icon}</Text>
      <Text style={{ fontSize: 24, fontWeight: "900", color: "#1C1C1E" }}>{value}</Text>
      <Text style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", lineHeight: 15 }}>{label}</Text>
      {sub && <Text style={{ fontSize: 10, fontWeight: "700", color: "#F59E0B", marginTop: 2 }}>{sub}</Text>}
    </View>
  );
}

function ReadingSummary({ pagesRead, totalMinutes, totalBooks }: any) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const rows = [
    { icon: "📄", label: "Páginas leídas", value: pagesRead },
    { icon: "🕐", label: "Tiempo de lectura", value: timeStr },
    { icon: "📊", label: "Libros totales", value: totalBooks },
  ];

  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 18, padding: 18,
      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#1C1C1E", marginBottom: 14 }}>
        Resumen de lectura
      </Text>
      {rows.map((row) => (
        <View key={row.label} style={{
          flexDirection: "row", justifyContent: "space-between",
          alignItems: "center", paddingVertical: 10,
          borderBottomWidth: 0.5, borderBottomColor: "#F1F5F9",
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 16 }}>{row.icon}</Text>
            <Text style={{ fontSize: 13, color: "#64748B" }}>{row.label}</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#1C1C1E" }}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

function AchievementsCard({ trophies }: any) {
  if (trophies.length === 0) {
    return (
      <View style={{
        backgroundColor: "#fff", borderRadius: 18, padding: 18,
        shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        alignItems: "center", justifyContent: "center", minHeight: 120,
      }}>
        <Text style={{ fontSize: 32 }}>🏆</Text>
        <Text style={{ fontSize: 13, color: "#94A3B8", marginTop: 8, textAlign: "center" }}>
          Aún no tienes logros
        </Text>
      </View>
    );
  }

  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 18, padding: 18,
      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#1C1C1E", marginBottom: 14 }}>
        Logros recientes
      </Text>

      {trophies.slice(0, 3).map((ach: any) => (
        <View key={ach.id} style={{
          flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14,
        }}>
          <View style={{
            width: 46, height: 46, borderRadius: 12,
            backgroundColor: TEAL_LIGHT,
            justifyContent: "center", alignItems: "center",
            flexShrink: 0,
          }}>
            <Text style={{ fontSize: 22 }}>{ach.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#1C1C1E", flex: 1 }}>{ach.name}</Text>
              <Text style={{ fontSize: 13, fontWeight: "800", color: TEAL, marginLeft: 6 }}>+{ach.xp_reward} XP</Text>
            </View>
            <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, lineHeight: 16 }}>{ach.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function TrophyGrid({ trophies }: any) {
  if (trophies.length === 0) return null;

  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 18, padding: 18,
      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#1C1C1E", marginBottom: 14 }}>
        Todos tus trofeos ({trophies.length})
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {trophies.map((t: any) => (
          <View key={t.id} style={{
            backgroundColor: "#F8FAFC", borderRadius: 12, padding: 12,
            alignItems: "center", width: 80,
          }}>
            <Text style={{ fontSize: 24 }}>{t.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: "600", textAlign: "center", marginTop: 4, lineHeight: 13 }} numberOfLines={2}>
              {t.name}
            </Text>
            <Text style={{
              fontSize: 9, marginTop: 2, textTransform: "capitalize",
              color: t.rarity === "legendary" ? "#F59E0B"
                : t.rarity === "epic" ? "#8B5CF6"
                : t.rarity === "rare" ? "#3B82F6" : "#94A3B8",
            }}>
              {t.rarity}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function RecentSessions({ sessions }: any) {
  if (sessions.length === 0) return null;

  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 18, padding: 18,
      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#1C1C1E", marginBottom: 14 }}>
        Sesiones recientes
      </Text>
      {sessions.slice(0, 5).map((s: any) => (
        <View key={s.id} style={{
          flexDirection: "row", justifyContent: "space-between",
          paddingVertical: 10,
          borderBottomWidth: 0.5, borderBottomColor: "#F1F5F9",
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#1C1C1E" }} numberOfLines={1}>
              {s.books?.title ?? "—"}
            </Text>
            <Text style={{ fontSize: 11, color: "#94A3B8" }}>
              {new Date(s.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", marginLeft: 8 }}>
            <Text style={{ fontSize: 12, color: "#64748B" }}>⏱ {s.minutes} min</Text>
            <Text style={{ fontSize: 12, color: "#64748B" }}>📄 {s.pages} págs</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function XpHistory({ events }: any) {
  if (events.length === 0) return null;

  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 18, padding: 18,
      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#1C1C1E", marginBottom: 14 }}>
        Historial de XP
      </Text>
      {events.slice(0, 5).map((e: any) => (
        <View key={e.id} style={{
          flexDirection: "row", justifyContent: "space-between",
          paddingVertical: 10,
          borderBottomWidth: 0.5, borderBottomColor: "#F1F5F9",
        }}>
          <Text style={{ fontSize: 13, color: "#64748B" }}>
            {e.source === "reading" ? "Sesión de lectura"
              : e.source === "book_completed" ? "Libro completado"
              : e.source === "trophy" ? "Logro" : e.source}
          </Text>
          <Text style={{ fontWeight: "700", color: TEAL }}>+{e.amount} XP</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const { loading, newTrophy, clearNewTrophy } = useProfileBootstrap();
  const { profile, xpEvents } = useAuthStore();
  const { userBooks, sessions } = useReadingStore();
  const { userTrophies } = useGamificationStore();

  const booksCompleted = userBooks.filter((b) => b.status === "completed").length;
  const totalBooks = userBooks.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.minutes, 0);
  const totalPages = sessions.reduce((acc, s) => acc + s.pages, 0);

  const name = profile?.name ?? "—";
  const xp = profile?.xp ?? 0;
  const { current: level } = getProgress(xp);

  if (loading) return null;

  if (newTrophy) {
    return (
      <TrophyUnlockedScreen
        trophy={newTrophy}
        onContinue={clearNewTrophy}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={{
          backgroundColor: "#fff", borderRadius: 20, padding: 20,
          alignItems: "center", marginBottom: 16,
          shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
          elevation: 3,
        }}>
          <View style={{ alignSelf: "flex-end", marginBottom: -10 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#F59E0B" }}>
              ⭐ {xp} XP
            </Text>
          </View>

          <Avatar name={name} />

          <Text style={{ fontSize: 28, fontWeight: "900", color: "#1C1C1E", marginBottom: 8 }}>
            {name}
          </Text>

          <View style={{
            flexDirection: "row", alignItems: "center", gap: 6,
            backgroundColor: TEAL_LIGHT, borderRadius: 20,
            paddingHorizontal: 14, paddingVertical: 6,
          }}>
            <Text style={{ fontSize: 14 }}>📖</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: TEAL }}>
              Nivel: <Text style={{ fontWeight: "900" }}>{level.label} ({level.sub})</Text>
            </Text>
          </View>

          <View style={{ width: "100%", marginTop: 20 }}>
            <ProgressPath xp={xp} />
          </View>
        </View>

        {/* Stats grid */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          <StatCard icon="📚" value={booksCompleted} label="Completados" />
          <StatCard icon="🔖" value={totalBooks - booksCompleted} label="Pendientes" />
          <StatCard icon="📄" value={totalPages} label="Páginas" />
          <StatCard icon="🕐" value={totalMinutes} label="Minutos" />
        </View>

        {/* Bottom cards */}
        <View style={{ flexDirection: "column", gap: 16 }}>
          {sessions.length > 0 && (
            <ReadingSummary
              pagesRead={totalPages}
              totalMinutes={totalMinutes}
              totalBooks={totalBooks}
            />
          )}

          <AchievementsCard trophies={userTrophies} />

          {userTrophies.length > 0 && (
            <TrophyGrid trophies={userTrophies} />
          )}

          {sessions.length > 0 && (
            <RecentSessions sessions={sessions} />
          )}

          {xpEvents.length > 0 && (
            <XpHistory events={xpEvents} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
