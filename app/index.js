import { useState, useEffect } from "react";
import { View, ScrollView, Text, SafeAreaView, Button } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Location from "expo-location"; // Import Location from Expo

import { COLORS, icons, images, SIZES } from "../constants";
import {
  Nearbyjobs,
  Popularjobs,
  ScreenHeaderBtn,
  Welcome,
} from "../components";

const Home = () => {
  const router = useRouter();

  const [locationData, setLocationData] = useState(null);

  // Function to handle location button press
  const handleLocationButtonPress = async () => {
    try {
      // Request location permissions.
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Fetch the user's current location.
      const location = await Location.getCurrentPositionAsync({});
      console.log("User's location:", location);

      // Send location data to your backend
      const { latitude, longitude } = location.coords;
      //   await sendLocationToBackend(latitude, longitude);

      //   console.log("Location data sent to backend successfully");
    } catch (error) {
      console.error("Error fetching or sending location:", error);
    }
  };

  // Function to send location data to the backend
  const sendLocationToBackend = async (latitude, longitude) => {
    // Implement the logic to send location data to your backend here
    // You can use fetch or any HTTP library of your choice

    try {
      await fetch("http://your-backend-api-url/update-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      });
    } catch (error) {
      console.error("Error sending location to backend:", error);
    }
  };

  // Use useEffect to periodically send location updates
  useEffect(() => {
    // const intervalId = setInterval(() => {
    //   handleLocationButtonPress();
    // }, 1000); // Send location every second

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />
          ),
          headerTitle: "",
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          {/* <Welcome />
          <Popularjobs />
          <Nearbyjobs /> */}

          {/* Location Button */}
          <Button title="Get My Location" onPress={handleLocationButtonPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
