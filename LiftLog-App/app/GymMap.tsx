import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker, Overlay, Region } from "react-native-maps";
import TransformedImage from './TransformedImage'; // Import the TransformedImage component
import apiClient from "./apiClient";
import { MachineGoals } from "./interfaces";

const { width: width, height: height } = Dimensions.get("window");

/* 
  

  interfaces


*/
interface GymMapProps {
  machineGoals: MachineGoals | null;
  gymMachines: any[];
  userId: string | null;
  unitWeight: string;
}
interface Marker {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  image: any;
}

// MAP STYLE IN JSON FORMAT - for Google Maps Styling Wizard
const customMapStyle = [

  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
]

// Image mapping object - used to avoid the error with using require in markers
const imageMapping: { [key: string]: any } = {
  "benchpress64.png": require("../assets/machineMarkers/benchpress64.png"),
  "barbellbicepcurl64.png": require("../assets/machineMarkers/barbellbicepcurl64.png"),
  "backsquat64.png": require("../assets/machineMarkers/backsquat64.png"),
  "pullup64.png": require("../assets/machineMarkers/pullup64.png"),
};

const GymMap: React.FC<GymMapProps> = ({machineGoals, gymMachines, userId, unitWeight}) => {
  const gymImageBounds = [
      { latitude: 0, longitude: 0 }, // Southwest (bottom-left corner)
      { latitude: 0.0008, longitude: 0.0008 },   // Northeast (top-right corner)
  ];

  /*
    Machine coordinates. Hardcoded for now but could possibly retrieve/store in gym database.
  */
  const markers: Marker[] = gymMachines.map((machine) => ({
    id: machine._id,
    title: machine.machineName,
    latitude: machine.latitude,
    longitude: machine.longitude,
    image: imageMapping[machine.image],
  }));

  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  // User/machine goal variables
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentReps, setCurrentReps] = useState<string>('');
  const [currentGoal, setCurrentGoal] = useState<string>('')

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

  function handleClose(): void {
    setSelectedMarker(null)
  };
  
  function handleMarkerPress(id: number): void {

    /* 
      We are given the id of the machine which we can use to get the marker.

      then we update selectedMarker to produce the overlay modal.
      
    */


      
      const marker = markers.find(marker => marker.id === id);
      setSelectedMarker(marker || null);
      if (marker && machineGoals) {
        setCurrentWeight(machineGoals[marker.id]?.currentWeight?.toString() || '');
        setCurrentReps(machineGoals[marker.id]?.currentReps?.toString() || '');
        setCurrentGoal(machineGoals[marker.id]?.currentGoal?.toString() || '');
      }
  }

  const handleSave = async () => {
    if (selectedMarker && userId) {
      const updatedGoals = {
        currentWeight: parseInt(currentWeight, 10),
        currentReps: parseInt(currentReps, 10),
        currentGoal: parseInt(currentGoal, 10),
      };

      const updateData = {
        goals: {
          machineGoals: {
            ...machineGoals,
            [selectedMarker.id]: updatedGoals
          }
        }
      };

      console.log(updateData);
      setSelectedMarker(null);

      try {
        console.log('sending update request to id: ', userId);
        console.log('payload: ', updateData);
        const goalUpdateResponse = await apiClient.put(`users/${userId}`, updateData);
        // Update local state if needed

        console.log('Response: ', goalUpdateResponse.data);

        console.log(goalUpdateResponse.data);
        if (machineGoals) {
          machineGoals[selectedMarker.id] = updatedGoals;
        }
      } catch (error) {
        console.error('Failed to update machine goals:', error);
      }
    }
  };

  return (
    <View style={styles.mapSection}>
      <MapView
        ref={mapViewRef}
        provider="google"
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: 0.0004,
          longitude: 0.0004,
          latitudeDelta: 0.0001, // Zooms in closer
          longitudeDelta: 0.0002,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
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
            <View style={styles.tipLine}></View>
            <Text style={styles.tipText}>
              Click on a machine to log your lift and to find out
              more information.
            </Text>
            <View style={styles.tipLine}></View>
            <Text style={styles.tipText}>
              Use the search feature to navigate to a machine.
            </Text>
            <View style={styles.tipLine}></View>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleHelpModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Marker Modal / machine information */}

      {/* Check if marker is null and render the modal if false

          set visibility and make transparent with an animation for rendering
      */}
      {/* Marker Modal / machine information */}
      {selectedMarker && (
        <Modal
          visible={!!selectedMarker}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedMarker(null)}
          >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{selectedMarker.title}</Text>
                {machineGoals && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Current Weight</Text>
                      <TextInput 
                        style={styles.input}
                        value={currentWeight}
                        onChangeText={setCurrentWeight}
                        keyboardType="numeric"
                      />
                      <Text style={styles.unitLabel}>{unitWeight}</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Current Reps</Text>
                      <TextInput
                        style={styles.input}
                        value={currentReps}
                        onChangeText={setCurrentReps}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Current Goal</Text>
                      <TextInput
                        style={styles.input}
                        value={currentGoal}
                        onChangeText={setCurrentGoal}
                        keyboardType="numeric"
                      />
                      <Text style={styles.unitLabel}>{unitWeight}</Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>

              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: "row", // Horizontal layout
    justifyContent: "flex-end", // Align buttons to the right
    alignItems: "center", // Center buttons vertically
    margin: "3%", // Responsive margin
    position: "absolute",
    bottom: "0%",
    right: "3%",
  },
  helpButton: {
    backgroundColor: "#FBFF96",
    borderRadius: 25,
    borderWidth: 1,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  helpButtonText: {
    fontSize: 24,
    color: "#000000",
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
    borderWidth: 1,
  },
  helpContent: {
    paddingVertical: '4%',
  },
  tipText: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: 'Reddit-Sans',
  },
  tipLine: {
    borderBottomWidth: 1,
    marginBottom: '5%',
    marginTop: '5%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalTitle: { 
    fontSize: 24, 
    textAlign: 'center',
    fontFamily: 'Roboto-Mono',
    paddingBottom: '5%',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  label: {
    position: 'absolute',
    top: '0%',
    left: '13.5%',
    fontSize: 12,
    color: '#000000',
    zIndex: 1,
    borderRadius: 50,
    backgroundColor: '#E2E8EB',
    paddingHorizontal: 4,
    fontFamily: 'Roboto-Mono',
  },
  unitLabel: {
    position: 'absolute',
    top: '0%',
    right: '18%',
    transform: [{ translateY: 14 }],
    fontSize: 16,
    fontFamily: 'Roboto-Mono',
    color: '#000000',
  },
  input: {
    height: 50,
    width: '80%',
    paddingHorizontal: '5%',
    borderRadius: 20,
    backgroundColor: '#E2E8EB',
    fontSize: 16,
    marginBottom: '8%',
    fontFamily: 'Roboto-Mono',
  },
  saveButton: {
    width: '80%',
    backgroundColor: "#FBFF96",
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: '2%',
  },
  saveButtonText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    fontFamily: 'Reddit-Sans',
    textAlign: 'center',
  },
  closeButton: {
    width: '80%',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FBFF96",
    borderRadius: 20,
    borderWidth: 1.5,
    alignSelf: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    fontFamily: 'Reddit-Sans',
    textAlign: 'center',
  },
});

export default GymMap;