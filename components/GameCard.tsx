// components/GameCard.tsx
// ------------------------------------------------------
// Reusable UI component to display a single game card
// Used inside the Home screen’s FlatList
// Shows cover image, title, genres, rating, and platforms
// ------------------------------------------------------

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

// Type definition for a single Game object passed from Firestore
type Props = {
  game: {
    id: string;
    title: string;
    coverUrl: string;       // Game image URL (banner/cover)
    genres?: string[];      // e.g. ["Action", "RPG"]
    ratingAvg?: number;     // average rating
    platforms?: string[];   // e.g. ["PC", "PS5", "Xbox"]
  };
};

// Main component: displays one game card
export default function GameCard({ game }: Props) {
  return (
    // Outer card container
    <View style={styles.card}>
      {/* Cover image (banner at top of card) */}
      <Image
        // fallback placeholder if no image available
        source={{ uri: game.coverUrl || "" }} // Should add url here later
        style={styles.cover}
        resizeMode="cover" // crop to fill width nicely
      />

      {/* Card body (text content below image) */}
      <View style={styles.body}>

        {/* ── Title row: game name + heart icon ── */}
        <View style={styles.titleRow}>
          {/* Truncate long titles with ... */}
          <Text numberOfLines={1} style={styles.title}>{game.title}</Text>

          {/* Placeholder for future “favorite” feature */}
          <Ionicons name="heart-outline" size={18} color="#cbd5e1" />
        </View>

        {/* ── Meta row: genres + star rating ── */}
        <View style={styles.metaRow}>
          {/* Display up to 2 genres (Action, RPG, etc.) */}
          {(game.genres ?? []).slice(0, 2).map(g => (
            <Text key={g} style={styles.metaSmall}>{g}</Text>
          ))}

          {/* If rating exists, show icon + number */}
          {typeof game.ratingAvg === "number" && (
            <>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.metaSmall}>{game.ratingAvg.toFixed(1)}</Text>
            </>
          )}
        </View>

        {/* ── Platforms row: small “chips” for PC/PS5/etc ── */}
        <View style={styles.chipsRow}>
          {/* Display up to 3 platform chips */}
          {(game.platforms ?? []).slice(0, 3).map(p => (
            <View key={p} style={styles.chip}>
              <Text style={styles.chipText}>{p}</Text>
            </View>
          ))}

          {/* If more than 3, show “+N” chip (e.g. +2) */}
          {game.platforms && game.platforms.length > 3 && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>+{game.platforms.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
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
    width: "100%",              // full card width
    height: COVER_H,            // fixed banner height
  },

  // Body section (below image)
  body: {
    padding: 12,
    gap: 6,                     // space between inner rows
  },

  // Title row (title + favorite icon)
  titleRow: {
    flexDirection: "row",       // horizontal layout
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
  },

  // Small gray text (used in meta row)
  metaSmall: {
    color: "#cbd5e1",
    fontSize: 12,
  },

  // Platforms row (chips)
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",           // wrap chips onto new line if needed
    gap: 8,
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
