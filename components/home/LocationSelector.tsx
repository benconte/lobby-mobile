import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  TextInput,
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const popularLocations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Miami, FL',
    'Las Vegas, NV',
    'San Francisco, CA',
    'Seattle, WA',
    'Boston, MA',
    'Nashville, TN',
    'Austin, TX'
  ];

  const filteredLocations = popularLocations.filter(location =>
    location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.label}>Select location</Text>
        <View style={styles.selectedLocation}>
          <Text style={styles.locationText}>{selectedLocation}</Text>
          <Ionicons name="chevron-down" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              value={searchText}
              onChangeText={setSearchText}
            />

            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => {
                    onLocationChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LocationSelector;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 5,
  },
  label: {
    color: '#666',
    fontSize: 14,
  },
  selectedLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});