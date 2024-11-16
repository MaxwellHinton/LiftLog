import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, Button, 
        StyleSheet, TouchableOpacity, Image,
        Modal, 
        FlatList
    } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const backButton= () => {
    router.back();
};

const go = () => {

};

interface Gym {
    _id: string;
    name: string;
    address? : string
    imageUrl?: string;
}


export default function moreInfoScreen() {
    
    const [weight, setWeight] = useState<string>('');
    const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>('');

    // small gym window state
    const [areGymsVisible, setAreGymsVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const response = await axios.get<Gym[]>('https://liftlog-backend.up.railway.app/gyms');
                setGyms(response.data);
                console.log('Fetched Gyms:', response.data);
            } catch(error) {
                console.error('Error fetching gyms:', error)
                alert('Error: Failed to load gyms. Please try again later.');
            }
        };

        fetchGyms();
    }, []);
    
    // code for profile picture selection -- uses ImagePicker
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false){
            alert('Permission to access camera roll is required to set a profile picture!');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if(!result.canceled) {
            setProfilePicture(result.assets[0].uri);
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
            {/* <Picker
                selectedValue={currentGym}
                onValueChange={(itemValue) => setCurrentGym(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a Gym" value="" color='#888' />
                {gyms.map((gym) => (
                    <Picker.Item key={gym._id} label={gym.name} value={gym._id} color='#888'/>
                ))}
            </Picker> */}

            <Button title="Submit" onPress={() => {}} />
            <Button title="Not right now" onPress= {go} />
            <Button title="back" onPress={backButton} />
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
