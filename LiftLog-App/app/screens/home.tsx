import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import GymMap from '../GymMap';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../apiClient';
import {UserData, UserGoals} from '../interfaces';

export default function Home() {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [machineGoals, setMachineGoals] = useState<UserGoals['machineGoals'] | null>(null);
  const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
  const [gymMachines, setGymMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gymName, setGymName] = useState<string>();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const slideAnimation = useRef(new Animated.Value(-100)).current;

  // users unit preference to be sent.
  const [unitWeight, setUnitWeight] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        if(!userId) throw new Error('User ID not found');

        //console.log("In home page trying to fetch the user with id: ", userId);

        const userResponse = await apiClient.get(`/users/${userId}`);
        const user = userResponse.data;

        console.log(user.currentGym);
        

        // set user information
        setUserData(userResponse.data);
        setUserId(user._id);
        setMachineGoals(user.goals?.machineGoals || {});
        setUnitWeight(user.unitWeight || 'kg');

        console.log(user.profilePicture);

        // Get user gym data for machine information

        const gymResponse = await apiClient.get(`/gyms/${user.currentGym}`);
        const gym = gymResponse.data;

        setGymName(gym.name); 
        setGymMachines(gym.machines || []);
        //console.log("IN HOME PAGE WITH ACTUAL DATA LETS GO :-:", userResponse.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData(); // functions called here
  }, []); // We need empty array here so that the useEffect runs once when the component mounts.

  if(loading){
    return <ActivityIndicator size="large" />;
  }

  const handleSettingsButton = () => {
    console.log('howdy');
  };

  const handleMenuButton = () =>  {
    setShowMenu(!showMenu);

    // trigger slide down animation
    Animated.timing(slideAnimation, {
      toValue: showMenu ? 0 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuButton}>
            <View style={[styles.line, styles.line1]}></View>
            <View style={[styles.line, styles.line2]}></View>
            <View style={[styles.line, styles.line3]}></View>
          </TouchableOpacity>
          {/* Gym Name and Search */}
          <Text style={styles.gymName}>{gymName || 'No Gym Selected'}</Text>

          <View style={styles.profilePicContainer}>
            <Image
              source={userData?.profilePicture 
                ? { uri: `https://liftlog-backend.up.railway.app/${userData.profilePicture}`} 
                : require('../../assets/images/defaultProfilePicture.png')}
              style={styles.profilePic}
              resizeMode='cover'
            />
          </View>
        </View>
        <Animated.View style={[
          styles.menu, 
          { transform: [{ translateY: slideAnimation}] },
          ]}
        >

        <TouchableOpacity style={styles.menuDropdownBtn}>
          <Text style={styles.menuButtonText}>Option 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuDropdownBtn}>
          <Text style={styles.menuButtonText}>Option 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuDropdownBtn} onPress={handleSettingsButton}  >
          <Image
            source={require('../../assets/images/settingsButton.png')}
            style={styles.settingsImage}
          />
          
        </TouchableOpacity>


        </Animated.View>


      
      {/* Gym Map */}
      <GymMap machineGoals={machineGoals} gymMachines={gymMachines} userId={userId} unitWeight={unitWeight}/>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/muscle.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>LiftLog</Text>
      </View>
      
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFF96',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    height: '12%',
    width: '100%',
    position: 'relative',
    zIndex: 3,
  },
  menu: {
    position: 'absolute',
    top: '0%', // 99.5% instead of 100% to also block out the headers bottom border
    width: '80%',
    left: '10%',
    height: '8%',
    backgroundColor: '#FBFF96',
    zIndex: 2,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  menuDropdownBtn: {
    borderRadius: 35,
    alignItems: 'center',
  },
  settingsImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  menuButtonText: {
    fontSize: 12,
    color: '#000000',
  },
  profilePicContainer: {
    width: '16%',
    height: '65%',
    right: '5%',
    borderRadius: 35, 
    borderWidth: 1.5,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%', 
    height: '100%',
  },
  menuButton: {
    justifyContent: "space-between", // Even spacing between lines
    alignItems: "flex-start", // Center the lines horizontally
    width: '16%', // Width of the overall icon
    height: '65%', // Height of the overall icon
    left: '5%',
  },
  line: {
    height: 18, // Height of each line
    backgroundColor: "#CCCCCC", // Light gray color for the lines
    borderRadius: 30, // Rounded edges for a modern look
    borderWidth: 1.5,
  },
  line1: {
    width: '100%', // Width of each line
  },
  line2: {
    width: '70%',
  },
  line3: {
    width: '50%',
  },

  // Gym Name
  gymName: {
    fontSize: 20,
    fontFamily: 'Roboto-Mono-Bold',
    color: '#000000',
  },

  // Map Section
  mapSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

  },

  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '5%',
    borderTopWidth: 1.5,
  },
  logoImage: {
    width: 40,
    height: 40,
    marginBottom: '1%',
    marginTop: '3%'
  },
  logoText: {
    fontSize: 20,
    fontFamily: 'Roboto-Mono-Bold',
    color: '#000000',
  },
});