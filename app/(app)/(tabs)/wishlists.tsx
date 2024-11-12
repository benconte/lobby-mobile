import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/context/themeContext';
import { Ionicons } from '@expo/vector-icons';
import UploadFile, { FileType } from '@/components/UploadFile';
import { getTheme } from '@/constants/Colors';

const Favorites = () => {
  const [file, setFile] = useState<FileType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOptionModalVisible, setOptionModalVisible] = useState(false);

  const { isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

  const handleUploadPress = () => {
    setOptionModalVisible(true);
  };

  const openContacts = async () => {
    try {
      // Different URL schemes for iOS and Android
      const url = Platform.select({
        ios: 'contacts://',
        android: 'content://com.android.contacts/contacts',
      });

      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert(
            "Error",
            "Cannot access contacts app on this device.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error('Error opening contacts:', error);
      Alert.alert(
        "Error",
        "Could not open contacts. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const renderActionButton = (
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    onPress: () => void
  ) => (
    <TouchableOpacity 
      style={[
        styles.actionButton, 
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={activeTheme.primary} 
      />
      <Text style={[
        styles.buttonText, 
        { color: activeTheme.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: activeTheme.background }
    ]}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={[
          styles.title, 
          { color: activeTheme.text }
        ]}>
          Favorites
        </Text>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          {/* Upload Section */}
          {file ? (
            <View style={styles.previewContainer}>
              <Image 
                source={{ uri: file.uri }} 
                style={styles.previewImage} 
              />
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={handleUploadPress}
              >
                <Text style={[
                  styles.buttonText, 
                  { color: activeTheme.primary }
                ]}>
                  Change Image
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            renderActionButton(
              "cloud-upload-outline",
              "Upload Image",
              handleUploadPress
            )
          )}

          {/* Contacts Button */}
          {renderActionButton(
            "people-outline",
            "Open Contacts",
            openContacts
          )}
        </View>

        {/* Upload File Modal */}
        <UploadFile
          file={file}
          setFile={setFile}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          isOptionModalVisible={isOptionModalVisible}
          setOptionModalVisible={setOptionModalVisible}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  actionsSection: {
    gap: 15,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  previewContainer: {
    alignItems: 'center',
    width: '100%',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  changeButton: {
    padding: 10,
  },
});

export default Favorites;