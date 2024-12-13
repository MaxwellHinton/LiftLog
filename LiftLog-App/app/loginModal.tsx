import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    source: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, source }) => {
    //const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [incorrectFields, setIncorrectFields] = useState<string[]>([]);
    const router = useRouter();
    
    const handleLogin = async () => {
      
      const missing = [];

      
      /* 
        make request to backend at /auth/login

        handle response

      */

      // backend request

      const userLogin = {
        email: email,
        password: password
      };

      try {
        const loginResponse = await axios.post('https://liftlog-backend.up.railway.app/auth/login', userLogin);
        console.log('User successfully logged in: ', loginResponse.data);

        const { access_token, user} = loginResponse.data;

        await SecureStore.setItemAsync('authToken', access_token);
        await SecureStore.setItemAsync('userId', user.id);

        console.log("login successful, going to home");

        onClose();

        if(source === 'signup'){
          router.push('./home');
        }else{
          router.push('./screens/home');
        }
        
      } catch (error) {
        if (axios.isAxiosError(error)){
          if(error.response?.status === 401){
            // set missing fields to highlight labels
            missing.push('email');
            missing.push('password');
            setIncorrectFields(missing);
            
            Alert.alert('Invalid credentials', 'The email or password you entered is incorrect.');
            return;
          } else{
            Alert.alert('Login failed', 'Please try again later.');
          }
        }

      }
      
      setIncorrectFields([]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={100} // Adjust this value to control the shift
                        style={styles.keyboardAvoidingContainer}
        >

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Login</Text>

          {/* Inputs Wrapper */}
          <View style={styles.inputsWrapper}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, incorrectFields.includes('email') && styles.incorrectLabel]}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, incorrectFields.includes('password') && styles.incorrectLabel]}>Password:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.27)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingContainer: {
    width: '95%', // Full width to match the overlay
    alignItems: 'center', // Center the modal horizontally
  },
  
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    width: '80%',
    minHeight: '50%',
    alignItems: 'center', // Center all content horizontally
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    marginBottom: '0%',
    textAlign: 'center',
    fontFamily: 'Roboto-Mono',
  },
  inputsWrapper: {
    width: '100%', // Ensure inputs span the modal width
    justifyContent: 'center', // Vertically align inputs
    alignItems: 'center', // Center inputs horizontally
    marginTop: '3%',
    
  },
  inputContainer: {
    width: '100%',
    marginBottom: '10%',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    top: '0%',
    left: '12%',
    fontSize: 12,
    color: '#000000',
    zIndex: 1,
    backgroundColor: '#E2E8EB',
    borderRadius: 50,
    fontFamily: 'Roboto-Mono',
    
  },
  incorrectLabel: {
    color: 'red',
  },
  input: {
    width: '90%',
    paddingVertical: '4%',
    borderRadius: 20,
    backgroundColor: '#E2E8EB',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '70%',
    paddingVertical: '3%',
    backgroundColor: '#FBFF96',
    borderWidth: 1.5,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: '8%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Reddit-Sans',
  },
});

  
export default LoginModal;