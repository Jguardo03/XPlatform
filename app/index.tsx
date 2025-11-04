// app/index.tsx
// LOGIN SCREEN (UI unchanged) good work Juan!
// I had some issues with auto-redirect loops so added logic to prevent that
// Also had issues with new users created so may be unnecessary code now as I was trying to fix
// I believe ive removed redundant code and just kept alot of error handling as its good to have anyway.
//
// What this does:
// • Email/Password login via Firebase
// • After success router.replace("/(tabs)/home") 
// • Auto-redirects already-signed-in *returning* users to tabs
//   (skips the very first session after a brand-new sign-up)
// • Clear status/busy handling and reliable tap targets

import { Link, usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";

// Your UI components (unchanged)
import { Boxes } from "../components/boxes";
import LoginHeater from "../components/loginHeater";
import { Typography } from "../components/Typography";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  // Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UX
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Prevent double-navigation & loops
  const hasRedirectedRef = useRef(false);

  // Auto-redirect returning signed-in users to tabs 
  // - Skips while a manual login is in flight (busy)
  // - Skips if we're already inside /(tabs)
  // - Skips the first-ever session after account creation
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        hasRedirectedRef.current = false; // allow redirect next time after login
        return;
      }
      if (busy) return; // don't fight manual login navigation
      if (hasRedirectedRef.current) return; // already redirected this session
      if (pathname?.startsWith("/(tabs)")) return; // we're already in tabs

      const creation = user.metadata?.creationTime ?? "";
      const lastSignIn = user.metadata?.lastSignInTime ?? "";
      const isFirstSession = creation === lastSignIn;

      if (!isFirstSession) {
        hasRedirectedRef.current = true;
        router.replace("/(tabs)/home"); // concrete screen
      }
    });
    return unsub;
  }, [router, busy, pathname]);

  // Login handler (explicit navigation on success)
  const onLogin = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !password) {
      setStatus("Please enter your email and password.");
      return;
    }

    try {
      setBusy(true);
      setStatus("Signing in…");

      await signInWithEmailAndPassword(auth, e, password);

      // Ensure the effect won’t try to redirect again
      hasRedirectedRef.current = true;
      // Go to your first tab screen
      router.replace("/(tabs)/home");
    } catch (err: any) {
      const code = err?.code || "";
      let msg = err?.message || "Login failed";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") msg = "Invalid email or password.";
      if (code === "auth/user-not-found") msg = "No account found for this email.";
      if (code === "auth/too-many-requests") msg = "Too many attempts. Try again later.";
      setStatus(msg);
      console.error("[Login] error:", code, err);
    } finally {
      setBusy(false);
    }
  };

  // Password reset (email required)
  const onForgot = async () => {
    const e = email.trim().toLowerCase();
    if (!e) {
      setStatus("Enter your email first, then tap Forgot Password.");
      return;
    }
    try {
      setBusy(true);
      await sendPasswordResetEmail(auth, e);
      setStatus("Reset email sent. Check your inbox.");
    } catch (err: any) {
      setStatus(err?.message || "Could not send reset email");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LoginHeater />

      <View style={Boxes.formBox}>
        <View>
          <Text style={Typography.h2}>Welcome Back</Text>
          <Text style={Typography.subtitle}>Log in to continue to Gameseerr</Text>
        </View>

        <View>
          <Text style={Typography.h4}>Email</Text>
          {/* Bind input to state */}
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
          {/* Bind input to state */}
          <TextInput
            placeholder="**********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[Boxes.textImputBox, Typography.placeholder]}
          />
        </View>

        {/* Inline status */}
        {!!status && <Text style={[Typography.subtitle, { color: "#fbbf24" }]}>{status}</Text>}

        {/* Links / Buttons */}
        <Pressable onPress={busy ? undefined : onForgot} accessibilityRole="button">
          <Text style={Typography.link}>Forgot Password?</Text>
        </Pressable>

        <Pressable
          onPress={busy ? undefined : onLogin}
          disabled={busy}
          accessibilityRole="button"
          style={[Boxes.button, { opacity: busy ? 0.6 : 1 }]}
        >
          <Text style={[Typography.h4, { color: "#FFFFFF" }]}>
            {busy ? "Please wait…" : "Login"}
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}>
          <Text style={Typography.subtitle}>Don't have an account?</Text>
          <Link style={Typography.link} href="/signUp">
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  );
}
