import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  TextInput,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';
import { getTheme } from '@/constants/Colors';

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
  const { isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

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

  const getThemedStyles = () => {
    return {
      selector: {
        ...styles.selector,
        borderColor: activeTheme.border,
        // backgroundColor: activeTheme.card,
      } as ViewStyle,
      label: {
        ...styles.label,
        color: activeTheme.secondary,
      } as TextStyle,
      locationText: {
        ...styles.locationText,
        color: activeTheme.text,
      } as TextStyle,
      modalContent: {
        ...styles.modalContent,
        backgroundColor: activeTheme.background,
      } as ViewStyle,
      modalTitle: {
        ...styles.modalTitle,
        color: activeTheme.text,
      } as TextStyle,
      searchInput: {
        ...styles.searchInput,
        borderColor: activeTheme.border,
        // backgroundColor: activeTheme.card,
        color: activeTheme.text,
      } as ViewStyle,
      locationItem: {
        ...styles.locationItem,
        borderBottomColor: activeTheme.border,
      } as ViewStyle,
      locationItemText: {
        color: activeTheme.text,
      } as TextStyle,
    };
  };

  const themedStyles = getThemedStyles();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={themedStyles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={themedStyles.label}>Select location</Text>
        <View style={styles.selectedLocation}>
          <Text style={themedStyles.locationText}>{selectedLocation}</Text>
          <Ionicons 
            name="chevron-down" 
            size={24} 
            color={activeTheme.text} 
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={themedStyles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={themedStyles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={activeTheme.text} 
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={themedStyles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor={activeTheme.secondary}
              value={searchText}
              onChangeText={setSearchText}
            />

            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={themedStyles.locationItem}
                  onPress={() => {
                    onLocationChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={themedStyles.locationItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  selector: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  label: {
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
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
});

export default LocationSelector;