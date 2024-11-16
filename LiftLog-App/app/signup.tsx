// app/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const handleNext = () => {
    // You might want to pass data to the next screen
    router.push('./additional-info');
  };

  const handleBack = () => {
    // router.push('./index');
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up to LiftLog</Text>
      <TextInput
        placeholder="Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Age"
        placeholderTextColor="#888"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Gender"
        placeholderTextColor="#888"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />
      <Button
      title="Next"
      onPress={() => {
        // if (password.length >= 6) {
        // handleNext();
        // } else {
        // alert('Your password must be at least 6 characters long');
        // }
        handleNext();
      }}
      />
      <Button title="Back" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
});
