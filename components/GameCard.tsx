// components/GameCard.tsx
// ------------------------------------------------------
// Reusable card for a game: cover, title, genres, rating, platforms
// ------------------------------------------------------

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  game: {
    id: string;
    title: string;
    coverUrl: string;
    genres?: string[];
    ratingAvg?: number;
    platforms?: string[];
  };
  // If provided, shows a filled heart and removes from wishlist
  onRemoveFromWishList?: () => void;
  // If provided (and remove not given), shows outline heart and adds to wishlist
  onAddToWishList?: () => void;
  // Card tap (e.g., open detail)
  onPress?: () => void;
};

export default function GameCard({
  game,
  onAddToWishList,
  onRemoveFromWishList,
  onPress,
}: Props) {
  const isInWishlistContext = !!onRemoveFromWishList;
  const onPressHeart = isInWishlistContext ? onRemoveFromWishList : onAddToWishList;

  return (
    <Pressable onPress={onPress} android_ripple={{ color: "#111827" }}>
      <View style={styles.card}>
        <Image
          source={{ uri: game.coverUrl || "" }}
          style={styles.cover}
          resizeMode="cover"
        />

        <View style={styles.body}>
          {/* Title + heart */}
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={styles.title}>
              {game.title}
            </Text>

            {!!onPressHeart && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onPressHeart();
                }}
                hitSlop={8}
              >
                <Ionicons
                  name={isInWishlistContext ? "heart" : "heart-outline"}
                  size={28}
                  color={isInWishlistContext ? "#ef4444" : "#cbd5e1"}
                />
              </Pressable>
            )}
          </View>

          {/* Genres + rating */}
          <View style={styles.metaRow}>
            {(game.genres ?? []).slice(0, 2).map((g) => (
              <Text key={g} style={styles.metaSmall}>
                {g}
              </Text>
            ))}

            {typeof game.ratingAvg === "number" && (
              <>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.metaSmall}>{game.ratingAvg.toFixed(1)}</Text>
              </>
            )}
          </View>

          {/* Platforms: single line (2 chips max) + overflow counter */}
          <View style={styles.chipsRow}>
            {(game.platforms ?? []).slice(0, 2).map((p) => (
              <View key={p} style={styles.chip}>
                <Text style={styles.chipText}>{p}</Text>
              </View>
            ))}
            {game.platforms && game.platforms.length > 2 && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>+{game.platforms.length - 2}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Fixed cover height (slightly larger on web)
const COVER_H = Platform.OS === "web" ? 220 : 200;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
    flex: 1,
  },
  cover: {
    width: "100%",
    height: COVER_H,
  },
  body: {
    padding: 12,
    gap: 6,
    minHeight: 92, // keeps cards visually even
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 18,
  },
  metaSmall: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "nowrap",
    minHeight: 22,
  },
  chip: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: "#cbd5e1",
    fontSize: 11,
  },
});
