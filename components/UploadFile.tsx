// src/components/upload/UploadFile.tsx
import React from "react";
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/themeContext";
import { getTheme } from "@/constants/Colors";

const { width } = Dimensions.get('window');

export type FileType = {
  uri: string;
  name: string;
  type: string;
};

interface UploadFileProps {
  file: FileType | null;
  setFile: React.Dispatch<React.SetStateAction<FileType | null>>;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isOptionModalVisible: boolean;
  setOptionModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OptionButtonProps {
  onPress: () => void;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const OptionButton: React.FC<OptionButtonProps> = ({ onPress, title, icon }) => {
  const { isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionButton,
      ]}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={activeTheme.primary} 
        style={styles.optionIcon}
      />
      <Text style={[
        styles.optionButtonText,
        { color: activeTheme.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const UploadFile: React.FC<UploadFileProps> = ({
  file,
  setFile,
  modalVisible,
  setModalVisible,
  isOptionModalVisible,
  setOptionModalVisible,
}) => {
  const { isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

  const toggleModal = () => {
    setOptionModalVisible(!isOptionModalVisible);
  };

  const handleImageResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets[0]) {
      setFile({
        uri: result.assets[0].uri,
        type: result.assets[0].type || "image",
        name: result.assets[0].fileName || "image.jpg",
      });
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      handleImageResult(result);
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      handleImageResult(result);
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("Failed to take photo. Please try again.");
    }
  };

  const handleOptionPress = async (option: "camera" | "gallery") => {
    setModalVisible(false);
    
    if (option === "camera") {
      await takePhoto();
    } else {
      await pickImage();
    }
    
    toggleModal();
  };

  return (
    <Modal
      transparent
      visible={isOptionModalVisible}
      animationType="slide"
      onRequestClose={toggleModal}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={toggleModal}
      >
        <View 
          style={[
            styles.modalContent,
            { backgroundColor: activeTheme.background }
          ]}
        >
          <View style={styles.header}>
            <Text style={[
              styles.title,
              { color: activeTheme.text }
            ]}>
              Upload Image
            </Text>
            <TouchableOpacity
              style={[
                styles.closeButton,
              ]}
              onPress={toggleModal}
            >
              <Ionicons 
                name="close" 
                size={24} 
                color={activeTheme.text} 
              />
            </TouchableOpacity>
          </View>

          <Text style={[
            styles.subtitle,
            { color: activeTheme.secondary }
          ]}>
            Choose an option to upload your image
          </Text>

          <View style={styles.optionsContainer}>
            <OptionButton
              title="Take Photo"
              icon="camera"
              onPress={() => handleOptionPress("camera")}
            />
            <OptionButton
              title="Choose from Gallery"
              icon="images"
              onPress={() => handleOptionPress("gallery")}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  optionIcon: {
    marginBottom: 8,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default UploadFile;
