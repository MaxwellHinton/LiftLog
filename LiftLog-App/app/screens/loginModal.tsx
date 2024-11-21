import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = () => {
        console.log('Logging in with:', email, password);
        onClose();
    };

    return(
        <Modal visible={visible} transparent animationType='slide'>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
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
}

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
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      fontFamily: 'Roboto-Mono-Bold',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 20,
      marginBottom: 20,
      padding: 10,
      width: '100%',
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
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