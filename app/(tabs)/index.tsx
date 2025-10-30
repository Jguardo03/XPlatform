import { signInAnonymously } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import {Link, useRouter} from 'expo-router';
import { useEffect, useState } from "react";
import { Text, View, StyleSheet,TextInput } from "react-native";
import app, { auth, db } from "../../lib/firebase";
import LoginHeater from "../../components/loginHeater";
import { Typography } from '../../components/Typography';
import {Boxes} from '../../components/boxes';

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


  const router = useRouter();
  return (
    <View style={{ flex: 1,}}>
      <LoginHeater/>
      <View style={Boxes.formBox}>
        <View>
          <Text style={Typography.h2}>Welcome Back</Text>
          <Text style={Typography.subtitle}>Log in to continue to Gameseerr</Text>
        </View>
        <View>
          <Text style={Typography.h4}>Email</Text>
          <TextInput placeholder="your@example.com" keyboardType="email-address" style={[Boxes.textImputBox, Typography.placeholder]}/>
        </View>
        <View>
          <Text style={Typography.h4}>Password</Text>
          <TextInput placeholder="**********" secureTextEntry={true} style={[Boxes.textImputBox, Typography.placeholder]} />
        </View>
        <Text style={Typography.link} onPress={()=>{}}>Forgot Password?</Text>
        <Text style={[Boxes.button, Typography.h4, {color:'#FFFFFF'}]} onPress={()=>{}}>Login</Text>
        <View style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:5}}>
          <Text style={Typography.subtitle}>Don't have an account?</Text>
          <Text style={Typography.link} onPress={() => {router.navigate('/signUp')}}>Sign Up</Text>
        </View>
    </View>
    </View>
  );
}
