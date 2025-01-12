import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Keyboard, TextInput } from 'react-native';
import { MachineDisplay, MachineGoals } from '../interfaces';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import apiClient from '../apiClient';

interface MyMachinesProps {
  machines: MachineDisplay[];
  machineGoals: MachineGoals;
  userId: string | string[];
  unitWeight: string | string[];
}

interface machine {
  [machineId: string]: {
    currentWeight?: number;
    currentReps?: number;
    currentGoal?: number;
  }
}

// Image mapping object - used to avoid the error with using require in markers
const imageMapping: { [key: string]: any } = {
  "benchpress64.png": require("../../assets/machineMarkers/benchpress64.png"),
  "barbellbicepcurl64.png": require("../../assets/machineMarkers/barbellbicepcurl64.png"),
  "backsquat64.png": require("../../assets/machineMarkers/backsquat64.png"),
  "pullup64.png": require("../../assets/machineMarkers/pullup64.png"),
  "": require("../../assets/machineMarkers/defaultMachineMarker.png"),
};

const MyMachinesTable: React.FC<MyMachinesProps> = ({ machines, machineGoals, userId, unitWeight }) => {
  // State to track "add" or "remove" status of each machine
  const [machineStatus, setMachineStatus] = useState<{ [key: string]: 'add' | 'remove' }>({});
  
  // State variable to track machine overlay popup
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const[selectedMachine, setSelectedMachine] = useState<MachineDisplay | null>(null);
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentReps, setCurrentReps] = useState<string>('');
  const [currentGoal, setCurrentGoal] = useState<string>('');

  // Function to toggle machine status
  const handleStatusChange = (id: string, status: 'add' | 'remove') => {
    setMachineStatus((prevState) => ({
      ...prevState,
      [id]: status,
    }));
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    if(selectedMachine && userId){
      console.log('machine to update', selectedMachine);
      console.log('user updating: ', userId);

      const updatedGoals = { 
        currentWeight: parseInt(currentWeight, 10),
        currentReps: parseInt(currentReps, 10),
        currentGoal: parseInt(currentGoal, 10),
      };

      const updateData = {
        goals: {
          machineGoals: {
            ...machineGoals,
            [selectedMachine._id]: updatedGoals,
          }
        }
      };

      try {
        console.log('sending update request to id: ', userId);
        console.log('payload: ', updateData);
        
        const machineGoalResponse = await apiClient.put(`users/${userId}`, updateData);

        console.log('Response: ', machineGoalResponse.data);

        if(machineGoals) {
          machineGoals[selectedMachine._id] = updatedGoals;
        }

        setModalVisible(false);
      } catch (error) {
        console.log('Failed to update machine goals: ', error);
      }
    };
  };

  const handleMachineClick = (machine: MachineDisplay) => {
    const goals = machineGoals[machine._id] || {};
    setCurrentWeight(goals.currentWeight?.toString() || '');
    setCurrentReps(goals.currentReps?.toString() || '');
    setCurrentGoal(goals.currentGoal?.toString() || '');
    setSelectedMachine(machine);
    setModalVisible(true);
    console.log(selectedMachine);
    console.log(isModalVisible);
  }

  // Render individual machine row
  const renderMachineRow = ({ item }: { item: MachineDisplay }) => {
    const status = machineStatus[item._id] || '';
    const isComingSoon = item.machineName === 'Machine coming soon...';

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          if(!isComingSoon) {
            handleMachineClick(item);
          }
        }}
        disabled={isComingSoon}
      >


        {/* Machine Image */}
        <Image source={imageMapping[item.image]} style={styles.image} />

        {/* Machine Name */}
        <Text style={styles.machineName}>{item.machineName}</Text>

        {/* Add and Remove Buttons */}
        {!isComingSoon && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, status === 'add' && styles.activeButton]}
              onPress={() => handleStatusChange(item._id, 'add')}
            >
              <Text style={[styles.buttonText, status === 'add' && styles.activeButtonText]}>Add</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={[styles.button, status === 'remove' && styles.activeButton]}
              onPress={() => handleStatusChange(item._id, 'remove')}
            >
              <Text style={[styles.buttonText, status === 'remove' && styles.activeButtonText]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}


      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[...machines,
            ...Array.from({ length: 3 }, (_, index) => ({
            _id: `default-${index}`,
            machineName: 'Machine coming soon...',
            image: '',
          })),
        ]}
        keyExtractor={(item) => item._id}
        renderItem={renderMachineRow}
      />
      {isModalVisible && selectedMachine &&(
        <Modal visible={isModalVisible} transparent animationType='slide'>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{selectedMachine.machineName}</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Current Weight</Text>
                  <TextInput
                    style={styles.input}
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitLabel}>{unitWeight}</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Current Reps</Text>
                  <TextInput
                    style={styles.input}
                    value={currentReps}
                    onChangeText={setCurrentReps}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Current Goal</Text>
                  <TextInput
                    style={styles.input}
                    value={currentGoal}
                    onChangeText={setCurrentGoal}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitLabel}>{unitWeight}</Text>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  machineName: {
    fontSize: 18,
    fontFamily: 'Roboto-Mono',
    flex: 1,
    marginLeft: 10,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
  },
  activeButton: {
    backgroundColor: '#FBFF96',
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Reddit-Sans',
    color: '#000000',
  },
  activeButtonText: {
    fontWeight: 'bold',
  },

  // machine modal styling
  modalOverlay: {
    justifyContent: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0)',
    alignItems: 'center',
    marginTop: '30%'

  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 24, 
    textAlign: 'center',
    fontFamily: 'Roboto-Mono',
    paddingBottom: '5%',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  label: {
    position: 'absolute',
    top: '0%',
    left: '13.5%',
    fontSize: 12,
    color: '#000000',
    zIndex: 1,
    borderRadius: 50,
    backgroundColor: '#E2E8EB',
    paddingHorizontal: 4,
    fontFamily: 'Roboto-Mono',
  },
  unitLabel: {
    position: 'absolute',
    top: '0%',
    right: '18%',
    transform: [{ translateY: 14 }],
    fontSize: 16,
    fontFamily: 'Roboto-Mono',
    color: '#000000',
  },
  input: {
    height: 50,
    width: '80%',
    paddingHorizontal: '5%',
    borderRadius: 20,
    backgroundColor: '#E2E8EB',
    fontSize: 16,
    marginBottom: '8%',
    fontFamily: 'Roboto-Mono',
  },
  saveButton: {
    width: '80%',
    backgroundColor: "#FBFF96",
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: '2%',
  },
  saveButtonText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    fontFamily: 'Reddit-Sans',
    textAlign: 'center',
  },
  closeButton: {
    width: '80%',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FBFF96",
    borderRadius: 20,
    borderWidth: 1.5,
    alignSelf: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    fontFamily: 'Reddit-Sans',
    textAlign: 'center',
  },
});

export default MyMachinesTable;
