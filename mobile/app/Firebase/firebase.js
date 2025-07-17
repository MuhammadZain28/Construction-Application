import { Platform } from "react-native";
import { firebaseConfig } from "./firebaseConfig";

export async function Database() {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      throw new Error("Must be run in a browser environment");
    }

    const { initializeApp, getApps } = await import("firebase/app");
    const { getDatabase } = await import("firebase/database");

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    return getDatabase(app);
  } else {
    
    const { initializeApp, getApps } = await import("firebase/app");
    const { getDatabase } = await import("firebase/database");

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    return getDatabase(app);
  }
}
