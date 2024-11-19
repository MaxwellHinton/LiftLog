import { useRouter } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image,Modal, FlatList, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from './userContext';
import { RegisterUserDto, UpdateUserProfileDto, GymDisplay } from './interfaces';


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
                username: userData.username,
                firstname: userData.firstname,
                lastname: userData.lastname,
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

            if (profilePicture) {
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
                    console.log("Error uploading profile picture: ", error);
                    if(axios.isAxiosError(error)) {
                        console.error('Axios error response uploading:', error.response?.data);
                    }
                }
            }

            // User is registered, now we add additional information if it was filled out.
            // if it was filled out, the length is > 0
            if(Object.keys(updateProfileData).length > 0) {
                
                const updatedResponse = await axios.put(`https://liftlog-backend.up.railway.app/users/${userId}`, updateProfileData);
                console.log('User profile updated:', updatedResponse.data);
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
        <View style={styles.container}>
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
            <Text style={styles.subheading}>This information can be added later in your user settings.</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Weight"
                placeholderTextColor="#888"
                value={weight}
                onChangeText={setWeight} 
            />
            <TouchableOpacity onPress={() => setAreGymsVisible(true)} style={styles.dropdownTrigger}>
                {selectedGym ? (
                <View style={styles.selectedGymContainer}>
                    <Image
                        
                        source={require('../assets/placeholder-image.png')} // Use a local placeholder image
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
                <Text style={styles.placeholderText}>Select a Gym</Text>
                )}
            </TouchableOpacity>

            <Modal visible={areGymsVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <FlatList
                    data={gyms}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        style={styles.gymItem}
                        onPress={() => {
                            setSelectedGym(item);
                            setAreGymsVisible(false);
                        }}
                        >
                        <Image
                            source={require('../assets/placeholder-image.png')} // Use a local placeholder image
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
                    <Button title="Close" onPress={() => setAreGymsVisible(false)} />
                </View>
                </View>
            </Modal>

            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Not right now" onPress={handleSubmit} />
            <Button title="back" onPress={() => router.back()} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
    },
    subheading: {
        fontSize: 16,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        width: '100%',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
        borderColor: 'gray',
        borderWidth: 1,
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
    },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    imagePickerText: {
        color: '#888',
        textAlign: 'center'
    },
    dropdownTrigger: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 8,
        width: '100%',
        marginBottom: 16,
        borderRadius: 4,
      },
      placeholderText: {
        color: '#888',
      },
      selectedGymContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      gymItem: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      gymImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc', // Placeholder background color
      },
      gymInfo: {
        marginLeft: 10,
        justifyContent: 'center',
      },
      gymName: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      gymAddress: {
        fontSize: 14,
        color: '#666',
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
      },
      modalContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 4,
        maxHeight: '80%',
        padding: 16,
      },
});
