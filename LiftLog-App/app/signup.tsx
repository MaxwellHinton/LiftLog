// app/signup.tsx
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { UserContext } from './userContext';

export default function SignupScreen() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext)!;
  
  // const [firstName, setFirstName] = useState<string>('');
  // const [lastName, setLastName] = useState<string>('');
  // const [username, setUsername] = useState<string>('');
  // const [email, setEmail] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  // const [age, setAge] = useState<string>('');
  // const [gender, setGender] = useState<string>('');
  
  const handleNext = () => {

    const { username, firstname, lastname, age, gender, email, password } = userData;
    // You might want to pass data to the next screen
    if (!username || !firstname || !lastname || !email || !password || !age || !gender || !email || !password ){
      alert('Error: Please fill in all required fields.');

      // could change all placeholder colors to red


      return;  
    }

    if(userData.password.length < 6 ){
      alert('Error: Password must be at least 6 characters long.');
    }

    router.push('./additional-info');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up to LiftLog</Text>
      <TextInput
        placeholder="First name"
        placeholderTextColor="#888"
        value={userData.firstname}
        onChangeText={(text) => setUserData({ ...userData, firstname: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Last name"
        placeholderTextColor="#888"
        value={userData.lastname}
        onChangeText={(text) => setUserData({ ...userData, lastname: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        placeholderTextColor="#888"
        value={userData.username}
        onChangeText={(text) => setUserData({ ...userData, username: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text})}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={userData.password}
        onChangeText={(text) => setUserData({ ...userData, password: text})}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Age"
        placeholderTextColor="#888"
        value={userData.age.toString()}
        onChangeText={(text) => setUserData({ ...userData, age: parseInt(text, 10) || 0})}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Gender"
        placeholderTextColor="#888"
        value={userData.gender}
        onChangeText={(text) => setUserData({ ...userData, gender: text})}
        style={styles.input}
      />
      <Button
        title="Next"
        onPress={handleNext}
      />
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
});
