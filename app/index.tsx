import { signInAnonymously } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import app, { auth, db } from "../lib/firebase";

export default function Index() {
  const [status, setStatus] = useState("Idle");

  async function run() {
    try {
      setStatus("Signing in anonymously…");
      const cred = await signInAnonymously(auth);
      console.log("Anon UID:", cred.user.uid);

      setStatus("Writing doc…");
      const ref = await addDoc(collection(db, "ping"), {
        from: "expo-test",
        createdAt: serverTimestamp(),
        uid: cred.user.uid,
      });

      setStatus("Reading doc…");
      const snap = await getDoc(doc(db, "ping", ref.id));
      setStatus(snap.exists() ? `OK ✓ ${ref.id}` : `ERR ✗ read failed`);
      console.log("projectId:", app.options.projectId);
    } catch (e: any) {
      console.error("Ping error:", e);
      setStatus(`ERR ✗ ${e.message || String(e)}`);
    }
  }

  useEffect(() => { run(); }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Firebase connection test</Text>
      <Text>{status}</Text>
      <Button title="Run again" onPress={run} />
    </View>
  );
}
