import { deleteDoc, doc } from "firebase/firestore";
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
import { getWishListGames, deleteFromWishlist, searchOnWishList, addToWishList} from "../../modules/wishlist";



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
}

// Layout constants
const GAP = 16;       // spacing between cards
const PAGE_PAD = 16;  // horizontal padding for the page


export default function WishlistScreen() {
    const [games, setGames] = useState<Game[]>([]); // list of all games from Firestore
    const [loading, setLoading] = useState(true);   // loader until games are fetched
    

    
    const { width } = useWindowDimensions();

    // -------------------------------
    // 🔹 Fetch favorites games from Firestore
    // -------------------------------
    useEffect(() => {

        const unsubscribe = getWishListGames((games) => {
                setGames(games);
                setLoading(false);
        },
        () => setLoading(false)
        );
        return unsubscribe;   
        },[]);

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
                <Text style={styles.heading}>Wishlist </Text>
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
                        {/* Game card component + add to wish list implementation */}
                        <GameCard game={item} onAddToWishList={()=> addToWishList(item)} onDeleteFromWishList={()=> deleteFromWishlist(item)} />
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