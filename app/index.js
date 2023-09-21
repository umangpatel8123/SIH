import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text, // Import the Text component
  SafeAreaView,
  Button,
  StyleSheet,
  TextInput,
} from "react-native";
import socketIOClient from "socket.io-client";
import * as Location from "expo-location";

const Home = () => {
  const [locationData, setLocationData] = useState(null);
  const [joinCode, setJoinCode] = useState(""); // State for input field

  // Define socketRef at the top of the component
  const socketRef = useRef(null);

  const handleJoinButtonPress = () => {
    // Handle the "Join" button press here
    console.log("Join button pressed with code:", joinCode);

    // Initialize the socket connection
    socketRef.current = socketIOClient("http://localhost:4000"); // Replace with your server URL

    // Emit the "joinRoom" event with the joinCode
    socketRef.current.emit("joinRoom", joinCode);

    // Listen for location updates
    socketRef.current.on("locationUpdate", (data) => {
      // Update the location data in the state
      setLocationData(JSON.parse(data)); // Parse JSON data
    });

    // Send location data at regular intervals
    setInterval(sendLocationData, 1000); // Send data every 10 seconds (adjust as needed)
  };

  const sendLocationData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      console.log("User's location:", location);

      const { latitude, longitude } = location.coords;

      // Create a JSON object with latitude and longitude
      const locationData = {
        latitude: latitude,
        longitude: longitude,
      };

      // Send location data as JSON to the server using the socketRef
      socketRef.current.emit(
        "locationUpdate",
        joinCode,
        JSON.stringify(locationData)
      );
    } catch (error) {
      console.error("Error fetching or sending location:", error);
    }
  };

  useEffect(() => {
    // Clean up the socket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonContainer}>
          <Button title="Get My Location" onPress={sendLocationData} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Join Code"
            value={joinCode}
            onChangeText={setJoinCode}
          />
          <Button title="Join" onPress={handleJoinButtonPress} />
        </View>
        {/* Wrap the locationData in a Text component */}
        <Text style={styles.locationText}>
          Location: {JSON.stringify(locationData)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  locationText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Home;
