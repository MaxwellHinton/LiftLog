import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Switch, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import GymSelectionModal from '../modals/GymSelectionModal';
import apiClient from '../apiClient';
import { GymDisplay } from '../interfaces';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  weight: string;

  // weight unit kg/lbs
  unit: string;

  // name of their current gym
  userGym: string;

  userId: string | null;
  refreshData: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose, weight, unit, userGym, userId, refreshData }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [weightUnit, setWeightUnit] = useState<string>(unit);
  const [userWeight, setUserWeight] = useState<string>(weight || '');

  const [gyms, setGyms] = useState<GymDisplay[]>([]);
  const [isGymModalVisible, setGymModalVisible] = useState(false);
  const [selectedGym, setSelectedGym] = useState<GymDisplay | null>(null);

  useEffect(() => {
    const fetchGyms = async () => {
        try {
            const apiResponse = await apiClient.get<GymDisplay[]>('/gyms');
            setGyms(apiResponse.data);
        } catch(error) {
            Alert.alert('Error',  'Failed to load gyms. Please try again later.');
        }
    };

    fetchGyms();
  }, []);

  const handleSelectGym = (gym: GymDisplay) => {
    setSelectedGym(gym);
    setGymModalVisible(false);
  };


  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleUnitChange = (unit: string) => {
    setWeightUnit(unit);
  };

  const handleSave = async () => {
    // Here you can handle the save logic, for example, saving the settings to AsyncStorage or a global state

    try {
      const updateData = {
          currentGym: selectedGym ? selectedGym._id : undefined,
          weight: userWeight ? parseFloat(userWeight): undefined,
          unitWeight: weightUnit ? weightUnit : undefined,
      };
  
      console.log('sending updated settings:', updateData);
  
      const response = await apiClient.put(`/users/${userId}`, updateData);

      console.log('settings updated successfully: ', response.data);

      refreshData();
      onClose();
    }  
    catch (error) {
      console.error('failed to update settings: ', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Settings</Text>

              {/* Notification Toggle */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Enable Notifications:</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  style={styles.switch}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Preferred Unit:</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[styles.radioButton, weightUnit === 'kg' && styles.radioButtonSelected]}
                    onPress={() => handleUnitChange('kg')}
                  >
                  <Text style={styles.radioText}>kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioButton, weightUnit === 'lbs' && styles.radioButtonSelected]}
                    onPress={() => handleUnitChange('lbs')}
                  >
                  <Text style={styles.radioText}>lbs</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Weight:</Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#000"
                    value={weight}
                    onChangeText={setUserWeight}
                    keyboardType="numeric"
                  />
              </View>

              <View style={styles.settingRow}>

                <Text style={styles.settingLabel}>Gym:</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setGymModalVisible(true)}
                >
                  <Text style={styles.buttonText}>
                    {userGym ? userGym : 'Select Your Gym'}
                  </Text>
                </TouchableOpacity>

              </View>

              <GymSelectionModal
                visible={isGymModalVisible}
                gyms={gyms}
                onSelectGym={handleSelectGym}
                onClose={() => setGymModalVisible(false)}
              />

              {/* Dark Mode Toggle */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Dark Mode:</Text>
                <Switch 
                  value={darkMode} 
                  onValueChange={toggleDarkMode}
                  style={styles.switch} 
                />
              </View>


              {/* Save and Close Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
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
    width: '95%',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    width: '80%',
    minHeight: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // switch setting styling
  switch: {
    left: '10%'
  },
  // weight setting styling 

  radioGroup: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    right: '1%',

  },
  radioButton: {
    paddingHorizontal: '14%',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ccc',
    marginHorizontal: '2%',
    backgroundColor: '#f9f9f9'
  },
  radioButtonSelected: {
    backgroundColor: '#FBFF96',
    borderColor: '#000',
  },
  radioText: {
    fontSize: 20,
    fontFamily: 'Reddit-Sans',
    color: '#000',
  },

  input: {
    width: '40%',
    paddingVertical: '2%',
    paddingHorizontal: '1%',
    borderRadius: 20,
    backgroundColor: '#E2E8EB',
    left: '6%',
},
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Roboto-Mono',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 0,
    paddingHorizontal: 5,
    paddingVertical: '4%',
    marginRight: 0,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Mono',
    color: '#000000',
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
    marginBottom: '4%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Reddit-Sans',
  },

  selectButton: {
    backgroundColor: '#FBFF96',
    paddingHorizontal: '3%',
    paddingVertical: '1%',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000000',
    left: '7%'
  },
});

export default SettingsModal;
