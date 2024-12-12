// app/signup.tsx
import React, { useContext, useState } from 'react';
import {View, Text, TextInput, Image, 
        StyleSheet, TouchableOpacity, 
        Keyboard, KeyboardAvoidingView,Modal,
        Platform, TouchableWithoutFeedback,
        FlatList} from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../contexts/userContext';
import LoginModal from '../loginModal';

export default function SignupScreen() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext)!;

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  
  const handleGenderSelect = (selectedGender: string) => {
    setUserData({ ...userData, gender: selectedGender });
    setGenderModalVisible(false);
  };

  const goToHomeForDev = () => {
    router.push('./home');
  }

  const handleNext = () => {

    const {  yourName, email, password, age, gender } = userData;
    const missing = [];

    if (!yourName) missing.push('yourName');
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    if (!age) missing.push('age');
    if (!gender) missing.push('gender');

    if (missing.length > 0) {
      setMissingFields(missing);
      alert('Error: Please fill in all required fields.');
      return;
    }

    if(userData.password.length < 6 ){
      alert('Error: Password must be at least 6 characters long.');
    }

    setMissingFields([]);
    router.push('./additional-info');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined }
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Header Section */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/muscle.png')}
              style={styles.logo}

            />
            <View style={styles.signUpTextContainer}> 
              <Text style={styles.headerText}>Sign up to </Text>
              <Text style={styles.headerTextBold}>LiftLog.</Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, missingFields.includes('yourName') && styles.missingLabel]}>Your Name</Text>
              <TextInput
                placeholderTextColor="#888"
                value={userData.yourName}
                onChangeText={(text) => setUserData({ ...userData, yourName: text })}
                style={styles.input}
              />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, missingFields.includes('email') && styles.missingLabel]}>Email address</Text>
              <TextInput
                placeholderTextColor="#888"
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, missingFields.includes('password') && styles.missingLabel]}>Password</Text>
            <TextInput
              placeholderTextColor="#888"
              value={userData.password}
              onChangeText={(text) => setUserData({ ...userData, password: text })}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, missingFields.includes('age') && styles.missingLabel]}>Age</Text>
            <TextInput
              placeholderTextColor="#888"
              value={userData.age.toString()}
              onChangeText={(text) =>
                setUserData({ ...userData, age: parseInt(text, 10) || 0 })
              }
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, missingFields.includes('gender') && styles.missingLabel]}>
              Gender
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setGenderModalVisible(true)}
            >
              <Text style={[styles.genderText, userData.gender ? {} : { color: '#888' }]}>
                {userData.gender || ''}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={isGenderModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setGenderModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                <FlatList
                  data={['Male', 'Female', 'Prefer not to say']}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => handleGenderSelect(item)}
                    >
                      <Text style={styles.modalOptionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setGenderModalVisible(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>


          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleNext/*goToHomeForDev*/}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style= {styles.button} onPress={()=> {router.back()}}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity> */}

          {/* Footer */}
          <Text style={styles.footerText}>
            Have an account?{' '}
            <Text style={styles.link} onPress={() => setLoginModalVisible(true)}>
              Sign in
            </Text>
          </Text>

          <LoginModal
            visible={isLoginModalVisible}
            onClose={(() => setLoginModalVisible(false))}
            source="signup"
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: '5%',
  },
  header: {
    alignItems: 'center',
    marginBottom: '20%',
    width: '100%',
  },
  signUpTextContainer: {
    flexDirection: 'row'
  },
  
  headerText: {
    fontSize: 24,
    color: '#000000',
    fontFamily: 'Roboto-Mono',
  },
  headerTextBold: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Roboto-Mono-Bold',
  },
  logo: {
    width: '30%',
    marginBottom: '5%',
    height: undefined,
    aspectRatio: 1,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    top: '0%',
    left: '13.5%',
    fontSize: 12,
    color: '#888',
    zIndex: 1,
    borderRadius: 50,
    backgroundColor: '#E2E8EB',
    paddingHorizontal: 4,
    fontFamily: 'Roboto-Mono',
  },
  missingLabel: {
    color: 'red',
  },
  input: {
    width: '80%',
    paddingVertical: '4%',
    paddingHorizontal: '5%',
    borderRadius: 20,
    backgroundColor: '#E2E8EB',
    fontSize: 16,
    marginBottom: '8%',
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

  // footer with link 
  footerText: {
    fontSize: 20,
    color: '#000000',
    marginTop: '10%',
  },
  link: {
    color: '#000000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  
  // Gender modal styling

  genderText: {
     fontSize: 16,
     color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Roboto-Mono-Bold',
  },
  modalOption: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Reddit-Sans',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
    width: '55%',
    backgroundColor: '#80D0D2',
    borderRadius: 20,
  },
  modalCloseButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Reddit-Sans',
  },
});
