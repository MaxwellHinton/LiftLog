import { Stack } from "expo-router";
import { UserProvider } from "./contexts/userContext";
import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Reddit-Sans': require('../assets/fonts/RedditSans-Regular.ttf'),
        'Roboto-Mono': require('../assets/fonts/RobotoMono-Regular.ttf'),
        'Roboto-Mono-Bold': require('../assets/fonts/RobotoMono-Bold.ttf'),
        'Reddit-Sans-Bold': require('../assets/fonts/RedditSans-Bold.ttf')
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if(!fontsLoaded){
    return <ActivityIndicator size="large" />;
  }

  return (
    <UserProvider>
      <Stack 
        screenOptions={ {
          headerShown: false,
        }}/>
    </UserProvider>
  );
}
