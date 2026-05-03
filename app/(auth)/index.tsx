// AUTH

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../src/services/supabase";

export default function AuthScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const isRegister = mode === "register";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: "700" }}>
          {isRegister ? "Crear cuenta" : "Ingresar"}
        </Text>

        <View style={{ gap: 12, marginTop: 24 }}>
          {isRegister && (
            <TextInput
              placeholder="Nombre"
              style={inputStyle}
              value={name}
              onChangeText={setName}
            />
          )}
          <TextInput
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={inputStyle}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {errorMessage ? (
          <Text style={{ color: "red", marginTop: 12 }}>{errorMessage}</Text>
        ) : null}

        <Pressable
          onPress={isRegister ? handleRegister : handleLogin}
          style={btnStyle}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff" }}>
              {isRegister ? "Registrarse" : "Ingresar"}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => setMode(isRegister ? "login" : "register")}>
          <Text style={{ marginTop: 16 }}>
            {isRegister ? "Ya tengo cuenta" : "Crear cuenta"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const inputStyle = {
  borderWidth: 1,
  padding: 12,
  borderRadius: 8,
};

const btnStyle = {
  marginTop: 20,
  backgroundColor: "#2563EB",
  padding: 14,
  borderRadius: 8,
  alignItems: "center" as const,
};
