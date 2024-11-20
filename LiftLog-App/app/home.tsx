import React from 'react';
import { View, Text, Image, Button, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Link, useRouter, Route, usePathname, router } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push('./signup');
  }

  return (
    <View style={styles.container}>
      <View style= {styles.header}>
        <Image 
          source={require('../assets/images/muscle.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>LiftLog</Text>
        <Text style={styles.subtitle}>Begin your fitness journey today!</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '5%',
  },
  header: {
    alignItems: 'center',
    marginBottom: '10%',
  },
  logo: {
    width: '25%',
    height: undefined,
    aspectRatio: 1, // Ensures the logo maintains a square aspect ratio
    marginBottom: '5%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginTop: '2%',
  },
  button: {
    width: '70%',
    paddingVertical: '3%',
    backgroundColor: '#97dbe7',
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: '3%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  signupText: {
    fontSize: 14,
    color: '#000000',
    marginVertical: '2%',
  },
});