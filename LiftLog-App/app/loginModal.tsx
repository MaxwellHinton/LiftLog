import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
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
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center', // Center all content horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto-Mono-Bold',
  },
  inputsWrapper: {
    width: '100%', // Ensure inputs span the modal width
    justifyContent: 'center', // Vertically align inputs
    alignItems: 'center', // Center inputs horizontally
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    top: '0%',
    left: '14%',
    fontSize: 12,
    color: '#888',
    zIndex: 1,
    backgroundColor: '#E2E8EB',
    borderRadius: 50,
    fontFamily: 'Roboto-Mono',
  },
  incorrectLabel: {
    color: 'red',
  },
  input: {
    width: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    width: '80%',
    paddingVertical: '3%',
    backgroundColor: '#80D0D2',
    borderRadius: 50,
    alignItems: 'center',
    marginTop: '5%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Reddit-Sans',
  },
});

  
export default LoginModal;