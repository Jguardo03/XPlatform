import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#60A5FA",
        tabBarInactiveTintColor: "#A0A0A0",
        tabBarStyle: { backgroundColor: "#0b1220", borderColor: "#0b1220", borderTopWidth: 0 },
        contentStyle: { backgroundColor: "#0b1220" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color = "#A0A0A0", size = 24 }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color = "#A0A0A0", size = 24 }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />

      {/* detail route lives inside tabs, but is hidden from the bar */}
      <Tabs.Screen name="game/[id]" options={{ href: null }} />
    </Tabs>
  );
}
