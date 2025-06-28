import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { loadFonts } from "../lib/loadFonts";
import commonStyles from "./baseStyles/baseStyles";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      await loadFonts();
      setFontsLoaded(true);
    }
    load();
  }, []);

  if (fontsLoaded)
    return (
      <Stack
        screenOptions={{
          headerTitle: "Blessed Box",
          headerTitleStyle: commonStyles.title
        }}
      />
    );
}
