import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Link, useRouter, Route, usePathname, router } from 'expo-router';
import LoginModal from './screens/loginModal';

export default function WelcomeScreen() {
  const router = useRouter();
  
  const [isLoginVisible, setLoginVisible] = useState<boolean>(false);
  
  const handleGetStarted = () => {
    router.push('./screens/signup');
  }
  
  const handleLogIn = () => {
  
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}/>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/muscle.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>LiftLog</Text>
        <Text style={styles.subtitle}>Begin your fitness journey today!</Text>
      </View>

      <View style={styles.buttonContainer}>

        {/* Login Button */}
        <TouchableOpacity style={[styles.button, styles.marginTop]} onPress={() => setLoginVisible(true)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Sign-Up Button */}
        <TouchableOpacity style={[styles.button, styles.marginTop]} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Sign-Up</Text>
        </TouchableOpacity>
      </View>


      {/* Login Modal */}
      <LoginModal visible={isLoginVisible} onClose={() => setLoginVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '0%',
  },
  logo: {
    width: '30%',
    height: undefined,
    aspectRatio: 1, // Ensures the logo maintains a square aspect ratio
    marginBottom: '5%',
  },
  header: {
    alignItems: 'center',
    width: '100%',
    paddingTop: '20%',
  },
  headerBox: {
    position: 'absolute',
    top: 0,
    backgroundColor: "#80D0D2",
    zIndex: 1,
    left: 0,
    right: 0,
    height: '15%',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Roboto-Mono-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginVertical: '5%',
    fontFamily: 'Reddit-Sans',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: '30%',
    justifyContent: 'space-between',
  },
  button: {
    width: '70%',
    paddingVertical: '3%',
    backgroundColor: '#80D0D2',
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: '1%',
    
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Reddit-Sans',
  },
  marginTop: {
    marginTop: 60,
  }
});