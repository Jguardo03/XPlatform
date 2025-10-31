import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../lib/firebase";

type GameDoc = {
  title: string;
  coverUrl: string;
  ratingAvg?: number;
  developer?: string;
  genres?: string[];
  platforms?: string[];
};

type Game = GameDoc & { id: string };

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(collection(db, "games"), orderBy("ratingAvg", "desc"));
        const snap = await getDocs(q);
        const data: Game[] = snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as GameDoc),
        }));
        setGames(data);
      } catch (e) {
        console.error("Error fetching games:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Added sign-out logic
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/"); // go back to login
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sign-out button at top right */}
      <View style={styles.topBar}>
        <Text style={styles.heading}>Discover Games</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.coverUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>
                {item.genres?.join(", ")}
                {item.ratingAvg ? ` · ⭐ ${item.ratingAvg.toFixed(1)}` : ""}
              </Text>
              <Text style={styles.platforms}>{item.platforms?.join(" | ")}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0F1A", padding: 16, paddingTop: 40 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: { color: "#F3F4F6", fontSize: 22, fontWeight: "800" },
  signOut: { color: "#60A5FA", fontSize: 14, fontWeight: "600" },
  card: { backgroundColor: "#111827", borderRadius: 16, marginBottom: 14, overflow: "hidden" },
  image: { width: "100%", height: 160 },
  info: { padding: 12 },
  title: { color: "#F3F4F6", fontSize: 16, fontWeight: "700" },
  sub: { color: "#9CA3AF", fontSize: 13, marginTop: 4 },
  platforms: { color: "#9CA3AF", fontSize: 12, marginTop: 6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0A0F1A" },
});
