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
import { supabase } from "../services/supabase";

export function AuthScreen() {
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
          data: {
            display_name: cleanName,
            name: cleanName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const user = data.user;

      if (!user) {
        setErrorMessage("No se pudo crear el usuario.");
        return;
      }

      if (!data.session) {
        setErrorMessage("Cuenta creada. Confirma tu email para iniciar sesion.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        name: cleanName,
      });

      if (profileError) {
        console.error("Error creating profile:", profileError.message);
      }
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
      }
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: "#F8FAFC",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#111827" }}>
          {isRegister ? "Crear cuenta" : "Ingresar"}
        </Text>

        <View style={{ gap: 12, marginTop: 24 }}>
          {isRegister ? (
            <TextInput
              autoCapitalize="words"
              onChangeText={setName}
              placeholder="Nombre"
              style={inputStyle}
              value={name}
            />
          ) : null}
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            style={inputStyle}
            value={email}
          />
          <TextInput
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={inputStyle}
            value={password}
          />
        </View>

        {errorMessage ? (
          <Text style={{ color: "#B91C1C", marginTop: 14 }}>
            {errorMessage}
          </Text>
        ) : null}

        <Pressable
          disabled={loading}
          onPress={isRegister ? handleRegister : handleLogin}
          style={{
            alignItems: "center",
            backgroundColor: loading ? "#94A3B8" : "#2563EB",
            borderRadius: 8,
            marginTop: 20,
            paddingVertical: 14,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
              {isRegister ? "Registrarse" : "Ingresar"}
            </Text>
          )}
        </Pressable>

        <Pressable
          disabled={loading}
          onPress={() => {
            setErrorMessage("");
            setMode(isRegister ? "login" : "register");
          }}
          style={{ alignItems: "center", marginTop: 16, paddingVertical: 8 }}
        >
          <Text style={{ color: "#2563EB", fontSize: 15, fontWeight: "700" }}>
            {isRegister ? "Ya tengo cuenta" : "Crear cuenta nueva"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const inputStyle = {
  backgroundColor: "#FFFFFF",
  borderColor: "#CBD5E1",
  borderRadius: 8,
  borderWidth: 1,
  fontSize: 16,
  paddingHorizontal: 14,
  paddingVertical: 12,
};
