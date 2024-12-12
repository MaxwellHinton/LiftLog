import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        if(!userId) throw new Error('User ID not found');

        //console.log("In home page trying to fetch the user with id: ", userId);

        const userResponse = await apiClient.get(`/users/${userId}`);
        const user = userResponse.data;

        console.log(user.currentGym);
        
        setUserData(userResponse.data);
        setUserId(user._id);
        setMachineGoals(user.goals?.machineGoals || {});

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profilePicContainer}>
          <Image
            source={userData?.profilePicture 
              ? { uri: `https://liftlog-backend.up.railway.app/${userData.profilePicture}`} 
              : require('../../assets/images/muscle.png')} // Replace with the actual profile image URL
            style={styles.profilePic}
            resizeMode='cover'
          />
        </View>

        <Text style={styles.welcomeText}>
          Welcome {userData?.yourName || 'Guest'}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.hamburgerBar} />
          <View style={styles.hamburgerBar} />
          <View style={styles.hamburgerBar} />
        </TouchableOpacity>
      </View>

      {/* Gym Name and Search */}
      <View style={styles.gymSearchSection}>
        <Text style={styles.gymName}>{gymName || 'No Gym Selected'}</Text>
      </View>
      
      {/* Gym Map */}
      <GymMap machineGoals={machineGoals} gymMachines={gymMachines} userId={userId}/>

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
    backgroundColor: '#80D0D2',
    paddingVertical: 15,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
  },
  profilePicContainer: {
    width: 70, 
    height: 70,
    borderRadius: 35, 
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  
  profilePic: {
    width: '100%', 
    height: '100%',
  },
  
  welcomeText: {
    fontSize: 20,
    right: '4%',
    color: '#000000',
    fontFamily: 'Reddit-Sans',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hamburgerBar: {
    width: 40,
    height: 7,
    backgroundColor: '#ffffff',
    borderRadius: 7,
  },


  // Gym Name and Search Section
  gymSearchSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
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
    marginHorizontal: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cccccc',
  },

  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '5%',
  },
  logoImage: {
    width: 40,
    height: 40,
    marginBottom: '1%',
  },
  logoText: {
    fontSize: 20,
    fontFamily: 'Roboto-Mono-Bold',
    color: '#000000',
  },
});