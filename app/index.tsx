import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Welcome to My App</Text>
      <Link href="/signin" asChild>
        <Button title="Go to Sign In" />
      </Link>
    </View>
  );
}
