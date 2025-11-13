import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import GameCard from "../../components/GameCard";
import { auth, db } from "../../lib/firebase";


// Define game structure for Firestore data
type Game = {
    id: string;          // wishlist document id
    gameId?: string;     // original game id from "games" collection
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
}

// Layout constants
const GAP = 16;       // spacing between cards
const PAGE_PAD = 16;  // horizontal padding for the page


export default function WishlistScreen() {
    const [games, setGames] = useState<Game[]>([]); // list of all games from Firestore
    const [loading, setLoading] = useState(true);   // loader until games are fetched

    const { width } = useWindowDimensions();
    const router = useRouter();

    // -------------------------------
    // 🔹 Fetch favorites games from Firestore
    // -------------------------------
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "users", user.uid, "wishlist"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const data: Game[] = querySnapshot.docs.map((d) => ({
                    id: d.id,
                    ...(d.data() as Omit<Game, "id">),
                }));
                setGames(data);
                setLoading(false);
            },
            (e) => {
                console.error("Error fetching games:", e);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

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
    // 🔹 Delete from wishlist 
    // -------------------------------
    const deleteFromWishlist = async (game: Game) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user is signed in");
                return;
            }
            await deleteDoc(doc(db, "users", user.uid, "wishlist", game.id));
            console.log(`Game ${game.title} removed from wishlist.`);
            Toast.show({
                type: 'success',
                text1: 'Removed from Wishlist',
                text2: `${game.title} has been removed from your wishlist.`,
            });
        } catch (e) {
            console.error("Error removing game from wishlist:", e);
            Toast.show({
                type: 'error',
                text1: 'Error removing from Wishlist',
                text2: `Could not remove ${game.title} from your wishlist.`,
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
                <Text style={styles.heading}>Wishlist</Text>
            </View>
            {/* Main grid list */}
            <FlatList
                data={games}
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
                renderItem={({ item }) => (
                    <View style={{ width: itemWidth }}>
                        {/* Game card component + remove from wishlist implementation */}
                        <GameCard
                            game={item}
                            onRemoveFromWishList={() => deleteFromWishlist(item)}
                            onPress={() =>
                                router.push({
                                    pathname: "/(tabs)/game/[id]",
                                    params: { id: String(item.gameId ?? item.id) },
                                })
                            }
                        />
                    </View>
                )}
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
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0A0F1A",
    },
});
