// components/GameCard.tsx
// ------------------------------------------------------
// Reusable UI component to display a single game card
// Used inside the Home screen’s FlatList
// Shows cover image, title, genres, rating, and platforms
// ------------------------------------------------------

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

// Type definition for a single Game object passed from Firestore
type Props = {
  game: {
    id: string;
    title: string;
    coverUrl: string;
    genres?: string[];
    ratingAvg?: number;
    platforms?: string[];
  };
  onAddToWishList?: () => void;
  onRemoveFromWishList?: () => void;
  onPress?: () => void;
};

export default function GameCard({ game, onAddToWishList, onRemoveFromWishList, onPress }: Props) {
  const isInWishlistContext = !!onRemoveFromWishList;
  const onPressHeart = isInWishlistContext ? onRemoveFromWishList : onAddToWishList;

  return (
    <Pressable onPress={onPress} android_ripple={{ color: "#111827" }}>
      <View style={styles.card}>
        <Image source={{ uri: game.coverUrl || "" }} style={styles.cover} resizeMode="cover" />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={styles.title}>{game.title}</Text>
            {!!onPressHeart && (
              <Pressable onPress={(e) => { e.stopPropagation(); onPressHeart?.(); }}>
                <Ionicons
                  name={isInWishlistContext ? "heart" : "heart-outline"}
                  size={28}
                  color={isInWishlistContext ? "#ef4444" : "#cbd5e1"}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.metaRow}>
            {(game.genres ?? []).slice(0, 2).map(g => (
              <Text key={g} style={styles.metaSmall}>{g}</Text>
            ))}
            {typeof game.ratingAvg === "number" && (
              <>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.metaSmall}>{game.ratingAvg.toFixed(1)}</Text>
              </>
            )}
          </View>

          {/* Platforms: single line only — 2 chips max + "+N" to keep card heights identical */}
          <View style={styles.chipsRow}>
            {(game.platforms ?? []).slice(0, 2).map(p => (
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

// Style definitions for layout and appearance
const styles = StyleSheet.create({
  // Outer card wrapper
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    overflow: "hidden",         // ensures rounded corners apply to image
    borderWidth: 1,
    borderColor: "#1f2937",
    flex: 1,                    // expand evenly within a grid cell
  },

  // Cover image area
  cover: {
    width: "100%",
    height: COVER_H,            // fixed banner height
  },

  // Body section (below image)
  body: {
    padding: 12,
    gap: 6,                     // space between inner rows
    minHeight: 92,              // keeps cards visually even
  },

  // Title row (title + favorite icon)
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  // Title text
  title: {
    color: "#e5e7eb",           // light gray text
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,              // prevents title overflow
  },

  // Genres + rating row
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 18,
  },

  // Small gray text (used in meta row)
  metaSmall: {
    color: "#cbd5e1",
    fontSize: 12,
  },

  // Platforms row (single line, no wrap)
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "nowrap",         // prevents height jump
    minHeight: 22,
  },

  // Each platform chip container
  chip: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 999,          // full rounded pill shape
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  // Platform chip text
  chipText: {
    color: "#cbd5e1",
    fontSize: 11,
  },
});
