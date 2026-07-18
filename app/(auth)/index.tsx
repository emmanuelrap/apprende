import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { colors, typography } from "@/src/theme";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../src/services/supabase";

export default function AuthScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.replace("/home");
        return;
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [router]);

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setErrorMessage("Completa nombre, email y password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { name: cleanName },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (!data.user) {
        setErrorMessage("No se pudo crear el usuario.");
        return;
      }

      if (!data.session) {
        setErrorMessage("Cuenta creada. Confirma tu email.");
        return;
      }

      router.replace("/home");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage("Completa email y password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace("/home");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo iniciar sesion.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (Platform.OS === "web") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        return;
      }

      const redirectTo = Linking.createURL("auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No se pudo conectar con Google.");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type !== "success") return;

      const hash = result.url.split("#")[1];
      if (!hash) throw new Error("No se recibió el token de acceso.");

      const params = Object.fromEntries(
        hash.split("&").map((p) => {
          const [k, v] = p.split("=");
          return [k, decodeURIComponent(v)];
        }),
      );

      if (!params.access_token)
        throw new Error("Token de acceso no encontrado.");

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token || "",
      });

      if (sessionError) throw sessionError;

      router.replace("/home");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error al iniciar con Google.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";

  if (checkingSession) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 80,
          paddingBottom: 48,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Text
          style={{
            fontSize: 42,
            fontWeight: "900",
            color: "#fff",
            letterSpacing: -1,
          }}
        >
          Apprende
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.8)",
            marginTop: 8,
            lineHeight: 22,
          }}
        >
          Aprende idiomas leyendo libros que te encantan.
        </Text>
      </LinearGradient>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: colors.text,
            marginBottom: 24,
          }}
        >
          {isRegister ? "Crear cuenta" : "Bienvenido de vuelta"}
        </Text>

        <View style={{ gap: 14 }}>
          {isRegister && (
            <View>
              <Text style={{ ...typography.badge, color: colors.textSecondary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Nombre
              </Text>
              <TextInput
                placeholder="Tu nombre"
                placeholderTextColor={colors.textVeryMuted}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}
          <View>
            <Text style={{ ...typography.badge, color: colors.textSecondary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Email
            </Text>
            <TextInput
              placeholder="tu@email.com"
              placeholderTextColor={colors.textVeryMuted}
              style={{
                backgroundColor: colors.white,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View>
            <Text style={{ ...typography.badge, color: colors.textSecondary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Contraseña
            </Text>
            <TextInput
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textVeryMuted}
              secureTextEntry
              style={{
                backgroundColor: colors.white,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {errorMessage ? (
          <View
            style={{
              backgroundColor: colors.errorBg,
              borderRadius: 12,
              padding: 12,
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 13, color: colors.error, lineHeight: 18 }}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={isRegister ? handleRegister : handleLogin}
          disabled={loading}
          style={{
            marginTop: 24,
            backgroundColor: colors.primary,
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#fff",
              }}
            >
              {isRegister ? "Crear cuenta" : "Iniciar sesión"}
            </Text>
          )}
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 24,
            gap: 12,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text style={{ fontSize: 13, color: colors.textMuted }}>o</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>

        <Pressable
          onPress={handleGoogleSignIn}
          disabled={loading}
          style={{
            marginTop: 16,
            backgroundColor: colors.white,
            borderRadius: 14,
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
            gap: 10,
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "500", color: "#5F6368" }}>
            G
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#5F6368" }}>
            Continuar con Google
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setMode(isRegister ? "login" : "register");
            setErrorMessage("");
          }}
          style={{ marginTop: 20, alignItems: "center" }}
        >
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {isRegister ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
