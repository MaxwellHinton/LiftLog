import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Marker, Overlay, Region } from "react-native-maps";
import TransformedImage from './TransformedImage'; // Import the TransformedImage component


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const GymMap = () => {
  const gymImageBounds = [
      { latitude: 0, longitude: 0 }, // Southwest (bottom-left corner)
      { latitude: 0.0008, longitude: 0.0008 },   // Northeast (top-right corner)
  ];

  const markers = [
    {
      id: 1, title: "Bench press", latitude: 0.0001032, longitude: 0.00019786666666666666,
      image: require("../assets/machineMarkers/benchpress64.png")
    },
    {
      id: 2, title: "Cardio Machines", latitude: 0.00042800000000000005, longitude: 0.00019786666666666666,
      image: require("../assets/machineMarkers/barbellbicepcurl64.png")
    },
    {
      id: 3, title: "Barbell Back Squat", latitude: 0.00036426666666666667, longitude: 0.0006512,
      image: require("../assets/machineMarkers/backsquat64.png")
    },
    {
      id: 4, title: "Pull ups", latitude: 0.0001032, longitude: 0.0006512,
      image: require("../assets/machineMarkers/pullup64.png")
    },
    {
      id: 5, title: "Preacher curls", latitude: 0.0006360000000000001, longitude: 0.0006512,
      image: require("../assets/machineMarkers/barbellbicepcurl64.png")
    }
  ];

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const mapViewRef = useRef<MapView>(null);
  
  const toggleHelpModal = () => {
      setIsHelpVisible(!isHelpVisible);
  };

  const handleRegionChangeComplete = (region: Region) => {
      
      
    const minLat = gymImageBounds[0].latitude;
    const maxLat = gymImageBounds[1].latitude;
    const minLng = gymImageBounds[0].longitude;
    const maxLng = gymImageBounds[1].longitude;

    const MIN_ZOOM = 0.000001; // Closest zoom level
    const MAX_ZOOM = 0.0009; // Farthest zoom level
      
    let newLat = region.latitude;
    let newLng = region.longitude;
    let newLatDelta = region.latitudeDelta;
    let newLngDelta = region.longitudeDelta;

    // Clamp latitude and longitude to keep within bounds
    if (region.latitude < minLat) newLat = minLat;
    if (region.latitude > maxLat) newLat = maxLat;
    if (region.longitude < minLng) newLng = minLng;
    if (region.longitude > maxLng) newLng = maxLng;

    if (region.latitudeDelta < MIN_ZOOM) newLatDelta = MIN_ZOOM;
    if (region.latitudeDelta > MAX_ZOOM) newLatDelta = MAX_ZOOM;
    if (region.longitudeDelta < MIN_ZOOM) newLngDelta = MIN_ZOOM;
    if (region.longitudeDelta > MAX_ZOOM) newLngDelta = MAX_ZOOM;

    // Update map region if clamped
    if (newLat !== region.latitude || newLng !== region.longitude ||
        newLatDelta !== region.latitudeDelta ||
        newLngDelta !== region.longitudeDelta) {

        mapViewRef.current?.animateToRegion({
        ...region,
        latitude: newLat,
        longitude: newLng,
        latitudeDelta: newLatDelta,
        longitudeDelta: newLngDelta,
      });
    }
  };

  
  function handleMarkerPress(id: number): void {


    throw new Error("Function not implemented.");
  }

  return (
    <View style={styles.mapSection}>
      <MapView
        ref={mapViewRef}
        provider="google"
        style={styles.map}
        initialRegion={{
          latitude: 0.0004,
          longitude: 0.0004,
          latitudeDelta: 0.0001, // Zooms in closer
          longitudeDelta: 0.0002,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* Overlay for the gym image */}
        <Overlay
          bounds={[
            [gymImageBounds[0].latitude, gymImageBounds[0].longitude],
            [gymImageBounds[1].latitude, gymImageBounds[1].longitude],
          ]}
          image={require("../assets/maps/3000x3000/homeGym.png")}
        />

        {markers.map(marker => (
          <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          image={marker.image}
          onPress={() => handleMarkerPress(marker.id)}
        >

        </Marker>
        ))}
      </MapView>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetButtonText}>↺</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpButton} onPress={toggleHelpModal}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Help Modal */}
      {isHelpVisible && (
        <View style={styles.helpContainer}>
          <ScrollView contentContainerStyle={styles.helpContent}>
            <Text style={styles.tipText}>
              Navigate the gym using the interactive map.
            </Text>
            <Text style={styles.tipText}>
              Click on a machine to log your lift, goals, reps, and to find out
              more information.
            </Text>
            <Text style={styles.tipText}>
              Use the search feature to navigate to a machine.
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleHelpModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapSection: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: screenWidth,
    height: screenHeight * 0.67,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
  },
  resetButton: {
    backgroundColor: "#80D0D2",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  helpButton: {
    backgroundColor: "#80D0D2",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  helpButtonText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  helpContainer: {
    position: "absolute",
    bottom: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
  },
  helpContent: {
    paddingVertical: 10,
  },
  tipText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#80D0D2",
    borderRadius: 20,
    alignSelf: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default GymMap;