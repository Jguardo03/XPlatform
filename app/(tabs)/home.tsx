// app/(tabs)/home.tsx
// Tried to keep as close to Figma mobile mockups whilst suiting the Firebase setup I created.

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import GameCard from "../../components/GameCard";
import { auth, db } from "../../lib/firebase";
import {addToWishList, deleteFromWishlist} from "../../modules/wishlist";



// Define game structure for Firestore data
type Game = {
  id: string;
  title: string;
  coverUrl: string;
  genres?: string[];
  ratingAvg?: number;
  platforms?: string[];
};

//Define user structure for Firestore data
type User = {
  uid: string;
  email: string;
  username: string;
  createdAt: Date;
  avatarUrl: string;
};

// Layout constants
const GAP = 16;       // spacing between cards
const PAGE_PAD = 16;  // horizontal padding for the page

export default function Home() {
  // -------------------------------
  // 🔹 State variables
  // -------------------------------
  const [games, setGames] = useState<Game[]>([]); // list of all games from Firestore
  const [loading, setLoading] = useState(true);   // loader until games are fetched
  const [search, setSearch] = useState("");       // text input search term
  const [genreFilter, setGenreFilter] = useState("All");       // selected genre
  const [platformFilter, setPlatformFilter] = useState("All"); // selected platform

  // Map of gameId -> wishlist document id (used to show pink heart + remove)
  const [wishlistMap, setWishlistMap] = useState<Record<string, string>>({});

  const router = useRouter();
  const { width } = useWindowDimensions();

  // -------------------------------
  // 🔹 Fetch all games from Firestore
  // -------------------------------
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(collection(db, "games"), orderBy("ratingAvg", "desc"));
        const snap = await getDocs(q);
        const data: Game[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Game, "id">),
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

  // -------------------------------
  // 🔹 Listen to wishlist so hearts stay in sync
  // -------------------------------
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "wishlist"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const next: Record<string, string> = {};
      snap.forEach((d) => {
        const data = d.data() as { gameId?: string };
        if (data.gameId) {
          next[data.gameId] = d.id;
        }
      });
      setWishlistMap(next);
    });

    return unsubscribe;
  }, []);

  // -------------------------------
  // 🔹 Sign-out logic
  // -------------------------------
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/"); // navigate back to login
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  // -------------------------------
  // 🔹 Responsive grid columns (adjust per screen width)
  // -------------------------------
  const numColumns = useMemo(() => {
    if (width >= 1200) return 3; // large desktop
    if (width >= 900) return 2;  // tablet / wide web
    return 1;                    // mobile
  }, [width]);

  // -------------------------------
  // 🔹 Compute item width per column (keeps consistent aspect ratio)
  // -------------------------------
  const itemWidth = useMemo(() => {
    const totalGaps = (numColumns - 1) * GAP;
    const usable = Math.max(0, width - PAGE_PAD * 2 - totalGaps);
    return Math.floor(usable / numColumns);
  }, [width, numColumns]);

  // -------------------------------
  // 🔹 Combined search + filter logic
  // -------------------------------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return games.filter((g) => {
      // search match: title, genre, or platform
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.genres?.some((x) => x.toLowerCase().includes(q)) ||
        g.platforms?.some((x) => x.toLowerCase().includes(q));

      // genre match (if user selected a genre)
      const matchesGenre =
        genreFilter === "All" ||
        g.genres?.some((x) => x.toLowerCase() === genreFilter.toLowerCase());

      // platform match (if user selected a platform)
      const matchesPlatform =
        platformFilter === "All" ||
        g.platforms?.some((x) => x.toLowerCase() === platformFilter.toLowerCase());

      return matchesSearch && matchesGenre && matchesPlatform;
    });
  }, [games, search, genreFilter, platformFilter]);

  // -------------------------------
  // 🔹 Add to wishlist
  // -------------------------------
  const addToWishList = async (game: Game) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is signed in");
        return;
      }

      await addDoc(collection(db, "users", user.uid, "wishlist"), {
        gameId: game.id,
        title: game.title,
        coverUrl: game.coverUrl,
        genres: game.genres,
        ratingAvg: game.ratingAvg,
        platforms: game.platforms,
        createdAt: new Date(),
      });
      console.log(`${game.title} added to wishlist`);
      Toast.show({
        type: "success",
        text1: `${game.title} added to wishlist`,
      });
    } catch (e) {
      console.error("Error adding to wishlist:", e);
      Toast.show({
        type: "error",
        text1: "Error adding to wishlist",
      });
    }
  };

  // -------------------------------
  // 🔹 Remove from wishlist
  // -------------------------------
  const removeFromWishList = async (game: Game) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is signed in");
        return;
      }

      const wishlistDocId = wishlistMap[game.id];
      if (!wishlistDocId) {
        return;
      }

      await deleteDoc(doc(db, "users", user.uid, "wishlist", wishlistDocId));
      console.log(`${game.title} removed from wishlist`);
      Toast.show({
        type: "success",
        text1: `${game.title} removed from wishlist`,
      });
    } catch (e) {
      console.error("Error removing from wishlist:", e);
      Toast.show({
        type: "error",
        text1: "Error removing from wishlist",
      });
    }
  };

  // -------------------------------
  // 🔹 Loading state
  // -------------------------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // -------------------------------
  // 🔹 Render main screen
  // -------------------------------
  return (
    <View style={styles.screen}>
      {/* Header Bar */}
      <View style={styles.topBar}>
        <Text style={styles.heading}>Discover Games</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Search + filters row */}
      <View style={styles.controlsRow}>
        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} style={styles.searchIcon} />
          <TextInput
            placeholder="Search games..."
            placeholderTextColor="#9aa3af"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Filter: genre (simple toggle cycle) */}
        <TouchableOpacity
          style={styles.fakeDropdown}
          onPress={() => {
            // simple rotation of filter options for now
            const next =
              genreFilter === "All"
                ? "Action"
                : genreFilter === "Action"
                ? "RPG"
                : genreFilter === "RPG"
                ? "Adventure"
                : "All";
            setGenreFilter(next);
          }}
        >
          <MaterialIcons name="filter-list" size={18} color="#9aa3af" />
          <Text style={styles.fakeDropdownText}>{genreFilter}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={18} color="#9aa3af" />
        </TouchableOpacity>

        {/* Filter: platform (simple toggle cycle) */}
        <TouchableOpacity
          style={styles.fakeDropdown}
          onPress={() => {
            const next =
              platformFilter === "All"
                ? "PC"
                : platformFilter === "PC"
                ? "PS5"
                : platformFilter === "PS5"
                ? "Xbox"
                : "All";
            setPlatformFilter(next);
          }}
        >
          <Text style={styles.fakeDropdownText}>{platformFilter}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={18} color="#9aa3af" />
        </TouchableOpacity>
      </View>

      {/* Count text below filters */}
      <Text style={styles.countText}>{filtered.length} games found</Text>

      {/* Main grid list */}
      <FlatList
        data={filtered}
        key={numColumns} // force reflow when layout changes
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: PAGE_PAD,
          rowGap: GAP,
          alignItems: "flex-start",
        }}
        columnWrapperStyle={numColumns > 1 ? { columnGap: GAP } : undefined}
        renderItem={({ item }) => {
          const isWishlisted = !!wishlistMap[item.id];

          return (
            <View style={{ width: itemWidth }}>
              <GameCard
                game={item}
                // If not in wishlist yet, allow adding
                onAddToWishList={
                  !isWishlisted ? () => addToWishList(item) : undefined
                }
                // If already in wishlist, show pink heart and allow removing
                onRemoveFromWishList={
                  isWishlisted ? () => removeFromWishList(item) : undefined
                }
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/game/[id]",
                    params: { id: String(item.id) },
                  })
                }
              />
            </View>
          );
        }}
      />
    </View>
  );
}

// -------------------------------
// 🔹 Styles
// -------------------------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1220",
    paddingTop: 40,
  },
  topBar: {
    paddingHorizontal: PAGE_PAD,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: { color: "#F3F4F6", fontSize: 22, fontWeight: "800" },
  signOut: { color: "#60A5FA", fontSize: 14, fontWeight: "600" },

  controlsRow: {
    paddingHorizontal: PAGE_PAD,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  searchWrap: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 220,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingLeft: 36,
    paddingRight: 12,
    justifyContent: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 12,
    color: "#9aa3af",
  },
  searchInput: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  fakeDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  fakeDropdownText: { color: "#e5e7eb" },
  countText: {
    paddingHorizontal: PAGE_PAD,
    color: "#9aa3af",
    fontSize: 12,
    marginBottom: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0F1A",
  },
});
