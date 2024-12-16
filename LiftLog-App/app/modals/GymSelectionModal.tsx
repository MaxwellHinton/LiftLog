import React from 'react';
import { Modal, View, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { GymDisplay } from '../interfaces';

interface GymSelectionModalProps {
  visible: boolean;
  gyms: GymDisplay[];
  onSelectGym: (gym: GymDisplay) => void;
  onClose: () => void;
}

const GymSelectionModal: React.FC<GymSelectionModalProps> = ({
  visible,
  gyms,
  onSelectGym,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <FlatList
            data={gyms}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => onSelectGym(item)}
              >
                <Image
                  source={require('../../assets/placeholder-image.png')} // Replace with actual gym image if available
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  gymImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gymAddress: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#FBFF96',
    padding: 10,
    borderRadius: 25,
    width: '40%',
    alignItems: 'center',
    borderWidth: 1,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GymSelectionModal;
