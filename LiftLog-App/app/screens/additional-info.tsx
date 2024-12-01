import { useRouter } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image,Modal, FlatList, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../contexts/userContext';
import { RegisterUserDto, UpdateUserProfileDto, GymDisplay } from '../interfaces';


export default function moreInfoScreen() {
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext)!;
    
    // Gym selection display State variables
    const [gyms, setGyms] = useState<GymDisplay[]>([]);

    // optional user data state variables
    const [weight, setWeight] = useState<string>('');
    const [selectedGym, setSelectedGym] = useState<GymDisplay | null>(null);
    const [profilePicture, setProfilePicture] = useState<string>('');

    // Gym selection window state variable
    const [areGymsVisible, setAreGymsVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const response = await axios.get<GymDisplay[]>('https://liftlog-backend.up.railway.app/gyms');
                setGyms(response.data);
            } catch(error) {
                Alert.alert('Error',  'Failed to load gyms. Please try again later.');
            }
        };

        fetchGyms();
    }, []);
    
    // code for profile picture selection -- uses ImagePicker
    const pickImage = async () => {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        permissionResult.granted = true;

        if (!permissionResult.granted){
            Alert.alert('Permission Requierd', 'Permission to access camera roll is required to set a profile picture!');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });
    
        if(!result.canceled && result.assets && result.assets.length > 0) {
            setUserData( { ...userData, profilePicture: result.assets[0].uri });
            setProfilePicture(result.assets[0].uri);
        }
    };

    // handle form submission
    const handleSubmit = async () => {
        // Prepare data to match backend DTO
        try {
            const registerData: RegisterUserDto = {
                yourName: userData.yourName,
                age: userData.age,
                gender: userData.gender,
                email: userData.email,
                password: userData.password,
            };

            const updateProfileData: UpdateUserProfileDto = {
                currentGym: selectedGym ? selectedGym._id : undefined,
                weight: weight ? parseFloat(weight): undefined,
            };

            Object.keys(updateProfileData).forEach((key) => {
                const value = updateProfileData[key as keyof UpdateUserProfileDto];
                if (value === undefined || value === '') {
                    delete updateProfileData[key as keyof UpdateUserProfileDto];
                }
            });

            // Register user with their required data.
            const registerResponse = await axios.post('https://liftlog-backend.up.railway.app/users', registerData);
            console.log('User registered: ', registerResponse.data);

            const userId = registerResponse.data._id;
            console.log(userId);

            if (profilePicture) {
                console.log("Handling profile picture upload");
                const formData = new FormData();
                formData.append('profilePicture', {
                  uri: profilePicture,
                  name: 'profile.jpg',
                  type: 'image/jpeg',
                } as any);
    
                try{
                    // try to upload the profile picture
                    const uploadResponse = await axios.post(`https://liftlog-backend.up.railway.app/users/${userId}/profile-picture`, formData,{
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log('Profile picture uploaded: ', uploadResponse.data);
                    updateProfileData.profilePicture = uploadResponse.data.profilePicture;
                } catch (error) {
                    console.error("Error uploading profile picture: ", error);
                    if(axios.isAxiosError(error)) {
                        console.error('Axios error response uploading:', error.response?.data);
                    }
                }
            }

            // User is registered, now we add additional information if it was filled out.
            // if it was filled out, the length is > 0
            if(Object.keys(updateProfileData).length > 0) {
                console.log("Attempting to update the users information: ", userId);
                console.log('Update payload being sent:', updateProfileData);
                
                try {
                    const updatedResponse = await axios.put(`https://liftlog-backend.up.railway.app/users/${userId}`, updateProfileData);
                    console.log('User profile updated:', updatedResponse.data);

                }catch(error){
                    console.error("Updating is fucking up");
                }
            }

            Alert.alert('Success', 'Account created successfully!');
            router.push('./home');
        } catch (error) {
            console.error('Error creating account: ', error);

            if(axios.isAxiosError(error)){
                console.error('Axios error response:', error.response?.data);
            }
            Alert.alert('Error', 'Failed to create account. Please try agian later.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
                <Image 
                source={require('../../assets/images/muscle.png')}
                style={styles.logo}

                />
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Additional Information</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profileImage} />
                ) : (
                    <Text style={styles.imagePickerText}>Choose a Profile Picture</Text>
                )}
                </TouchableOpacity>
            </View>
    
    
            {/* Input Fields */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={weight}
                    onChangeText={setWeight}
                />
            </View>
    
            {/* Gym Selection */}

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Select your Gym</Text>
                    <TouchableOpacity onPress={() => setAreGymsVisible(true)} style={styles.dropdownTrigger}>
                        {selectedGym ? (
                        <View style={styles.selectedGymContainer}>
                            <Image
                            source={require('../../assets/placeholder-image.png')} // Placeholder image
                            style={styles.gymImage}
                            />
                            <View style={styles.gymInfo}>
                            <Text style={styles.gymName}>{selectedGym.name}</Text>
                            <Text style={styles.gymAddress}>
                                {selectedGym.address || 'Address not available'}
                            </Text>
                            </View>
                        </View>
                        ) : (
                        <Text style={styles.placeholderText}></Text>
                        )}
                    </TouchableOpacity>
            </View>
    
            {/* Modal for Gym Selection */}
            <Modal visible={areGymsVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <FlatList
                    data={gyms}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        style={styles.modalOption}
                        onPress={() => {
                            setSelectedGym(item);
                            setAreGymsVisible(false);
                        }}
                        >
                        <Image
                            source={require('../../assets/placeholder-image.png')}
                            style={styles.gymImage}
                        />
                        <View style={styles.gymInfo}>
                            <Text style={styles.gymName}>{item.name}</Text>
                            <Text style={styles.gymAddress}>
                            {item.address || 'Address not available'}
                            </Text>
                        </View>
                        </TouchableOpacity>
                    )}
                    />
                    <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setAreGymsVisible(false)}
                    >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
    
            {/* Action Buttons */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            {/* Subheading */}
            <Text style={styles.subheading}>
                This information is optional and can be added later in your user settings.
            </Text>
        </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    );
};

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
    headerContainer: {
        alignItems: 'center',
        marginBottom: '20%',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Mono-Bold',
        color: '#000000',
    },
    logo: {
        width: '30%',
        marginBottom: '5%',
        height: undefined,
        aspectRatio: 1,
    },
    subheading: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Roboto-Mono',
        marginBottom: '5%',
        width: "80%",
        marginTop: '10%',
        
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
        backgroundColor: 'E2E8EB',
        paddingHorizontal: 4,
        fontFamily: 'Roboto-Mono',
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
    imagePicker: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100,
        borderRadius: 50,
        borderColor: 'gray',
        borderWidth: 1,
        overflow: 'hidden',
        marginTop: '10%',
    },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    imagePickerText: {
        color: '#888',
        textAlign: 'center',
        fontFamily: 'Roboto-Mono',
    },
    dropdownTrigger: {
        paddingVertical: '4%',
        paddingHorizontal: '5%',
        padding: 8,
        width: '80%',
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: '#E2E8EB',
    },
    placeholderText: {
        color: '#888',
    },
    selectedGymContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gymImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc',
    },
    gymInfo: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    gymName: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Mono',
        color: '#000000',
    },
    gymAddress: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Roboto-Mono',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalOption: {
        padding: 15,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
        fontFamily: 'Roboto-Mono',
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