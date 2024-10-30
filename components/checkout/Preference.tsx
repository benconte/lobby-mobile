import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {
  PreferencesProps,
  PreferenceOption,
  BookingPreferences
} from "@/types/booking";
import { PREFERENCES } from "@/config/constants";

const Preferences: React.FC<PreferencesProps> = ({ bookingDetails, onNext }) => {
  // Initialize with existing preferences if any
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    bookingDetails.preferences?.preferences || []
  );
  const [specialRequests, setSpecialRequests] = useState<string>(
    bookingDetails.preferences?.specialRequests || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePreference = useCallback((id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const validateAndSubmit = useCallback(() => {
    setIsSubmitting(true);

    try {
      // Create preferences data
      const preferencesData: BookingPreferences = {
        preferences: selectedPreferences,
        specialRequests: specialRequests.trim(),
      };

      // Optional: Add any validation logic here
      if (specialRequests.length > 500) {
        Alert.alert(
          "Validation Error",
          "Special requests must be less than 500 characters"
        );
        return;
      }

      onNext(preferencesData);
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error saving your preferences. Please try again."
      );
      console.error("Error saving preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPreferences, specialRequests, onNext]);

  const renderPreference = useCallback(({ id, icon, title, description }: PreferenceOption) => {
    const isSelected = selectedPreferences.includes(id);

    return (
      <TouchableOpacity
        key={id}
        style={[
          styles.preferenceItem,
          isSelected && styles.preferenceItemSelected,
        ]}
        onPress={() => togglePreference(id)}
        activeOpacity={0.7}
      >
        <View style={styles.preferenceIcon}>
          <Ionicons
            name={icon}
            size={24}
            color={isSelected ? Colors.light.primary : "#666"}
          />
        </View>
        <View style={styles.preferenceInfo}>
          <Text style={styles.preferenceTitle}>{title}</Text>
          <Text style={styles.preferenceDescription}>{description}</Text>
        </View>
        <Ionicons
          name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
          size={24}
          color={isSelected ? Colors.light.primary : "#ddd"}
        />
      </TouchableOpacity>
    );
  }, [selectedPreferences, togglePreference]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Room Preferences</Text>
          <Text style={styles.subtitle}>
            Select your preferences for a more comfortable stay
          </Text>

          <View style={styles.preferencesContainer}>
            {PREFERENCES.map(renderPreference)}
          </View>

          <Text style={styles.sectionTitle}>Special Requests</Text>
          <TextInput
            style={styles.specialRequests}
            multiline
            numberOfLines={4}
            placeholder="Enter any special requests or requirements..."
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholderTextColor="#999"
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {specialRequests.length}/500 characters
          </Text>

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle"
              size={20}
              color={Colors.light.primary}
            />
            <Text style={styles.infoText}>
              All preferences and special requests are subject to availability and
              cannot be guaranteed. We will do our best to accommodate your requests.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateAndSubmit}
          disabled={isSubmitting}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
    fontSize: 14,
  },
  preferencesContainer: {
    marginBottom: 30,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },
  preferenceItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}10`,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: '#333',
  },
  preferenceDescription: {
    color: "#666",
    fontSize: 14,
    marginTop: 2,
  },
  specialRequests: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 150,
    color: '#333',
    backgroundColor: 'white',
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Preferences;
