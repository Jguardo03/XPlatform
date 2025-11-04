// app/signUp.tsx
// SIGN-UP SCREEN (UI unchanged)
//
// What this does:
// • Creates an Auth user with Email/Password
// • Writes a minimal profile doc to Firestore: users/{uid}
// • Immediately signs the user out (so Login shows next; prevents auto-skip)
// • Redirects back to "/" (your Login screen)
// • Clear status/busy handling and reliable tap target

import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

import { Boxes } from "../components/boxes";
import LoginHeater from "../components/loginHeater";
import { Typography } from "../components/Typography";

export default function SignUp() {
  const router = useRouter();

  // Inputs + UX
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Create account, write profile, sign out, go to Login
  const onSignUp = async () => {
    const e = email.trim().toLowerCase();

    // Quick client validation
    if (!e || !password || !confirm) return setStatus("Please fill in all fields.");
    if (password.length < 6) return setStatus("Password must be at least 6 characters.");
    if (password !== confirm) return setStatus("Passwords do not match.");

    try {
      setBusy(true);
      setStatus("Creating account…");

      // 1) Create Auth user
      const cred = await createUserWithEmailAndPassword(auth, e, password);

      // 2) Set a friendly displayName
      const username = e.split("@")[0];
      await updateProfile(cred.user, { displayName: username });

      // 3) Minimal Firestore profile
      await setDoc(doc(db, "users", cred.user.uid), {
        username,
        email: e,
        avatarUrl: "",
        createdAt: serverTimestamp(),
      });

      // 4) Sign out so the Login screen shows next (prevents auto-skip to tabs)
      await signOut(auth);

      setStatus("Account created. Redirecting to login…");

      // 5) Back to login (index.tsx maps to "/")
      router.replace("/");
    } catch (err: any) {
      const code = err?.code || "";
      let msg = err?.message || "Sign up failed";
      if (code === "auth/email-already-in-use") msg = "This email is already in use.";
      if (code === "auth/invalid-email") msg = "Please enter a valid email address.";
      setStatus(msg);
      console.error("[SignUp] error:", code, err);
    } finally {
      setBusy(false);
    }
  };

  const style = StyleSheet.create({
    option: { flexDirection: "row", alignItems: "center", gap: 10 },
  });

  return (
    <ScrollView>
      <LoginHeater />
      <View style={Boxes.formBox}>
        <View>
          <Text style={Typography.h2}>Create Account</Text>
          <Text style={Typography.subtitle}>Sign up to get started!</Text>
        </View>

        <View>
          <Text style={Typography.h4}>Email</Text>
          <TextInput
            placeholder="your@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={[Boxes.textImputBox, Typography.placeholder]}
          />
        </View>

        <View>
          <Text style={Typography.h4}>Password</Text>
          <TextInput
            placeholder="**********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[Boxes.textImputBox, Typography.placeholder]}
          />
        </View>

        <View>
          <Text style={Typography.h4}>Confirm Password</Text>
          <TextInput
            placeholder="**********"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={[Boxes.textImputBox, Typography.placeholder]}
          />
        </View>

        {/* Presentational for now (wire later if you want) */}
        <View style={{ gap: 8 }}>
          <Text style={Typography.h4}>Owned Consoles</Text>
          <View style={style.option}><Pressable style={Boxes.checkBox} /><Text style={Typography.body}>PlayStation 5</Text></View>
          <View style={style.option}><Pressable style={Boxes.checkBox} /><Text style={Typography.body}>PlayStation 4</Text></View>
          <View style={style.option}><Pressable style={Boxes.checkBox} /><Text style={Typography.body}>Xbox Series X/S</Text></View>
          <View style={style.option}><Pressable style={Boxes.checkBox} /><Text style={Typography.body}>Nintendo Switch</Text></View>
          <View style={style.option}><Pressable style={Boxes.checkBox} /><Text style={Typography.body}>Mobile</Text></View>
          <View style={style.option}><Pressable style={Boxes.checkBox} /><Text style={Typography.body}>PC</Text></View>
        </View>

        {!!status && <Text style={[Typography.subtitle, { color: "#fbbf24" }]}>{status}</Text>}

        <Pressable
          onPress={busy ? undefined : onSignUp}
          disabled={busy}
          accessibilityRole="button"
          style={[Boxes.button, { opacity: busy ? 0.6 : 1 }]}
        >
          <Text style={[Typography.h4, { color: "#FFFFFF" }]}>
            {busy ? "Please wait…" : "Sign Up"}
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}>
          <Text style={Typography.subtitle}>Already have an account?</Text>
          <Text style={Typography.link} onPress={() => router.back()}>
            Log In
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
