import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Link, useRouter, Route, usePathname, router } from 'expo-router';
import LoginModal from './loginModal';

const handleGetStarted = () => {
  router.push('./signup');
}

const handleLogIn = () => {

}

export default function WelcomeScreen() {

  const [isLoginVisible, setLoginVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LiftLog</Text>
      <Text style={styles.subtitle}>Begin your fitness journey today!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setLoginVisible(true)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <LoginModal visible={isLoginVisible} onClose={() => setLoginVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create( {
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold',
  },
  subtitle: { fontSize: 18, marginVertical: 20},
  
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40, // Add padding to the container
  },
  button: {
    backgroundColor: '#3d5ca5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  
});