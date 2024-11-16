import React from 'react';
import { View, Text, Button, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Link, useRouter, Route, usePathname, router } from 'expo-router';

const handleGetStarted = () => {
  router.push('./signup');
}

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LiftLog</Text>
      <Text style={styles.subtitle}>Begin your fitness journey today!</Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create( {
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold'},
  subtitle: { fontSize: 18, marginVertical: 20},
  button: {
    backgroundColor: '#3d5ca5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});