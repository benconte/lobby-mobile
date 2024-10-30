import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Proper typing for booking details to match parent component
interface BookingDetails {
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  nights: number;
}

interface GuestFormProps {
  bookingDetails: BookingDetails;
  onNext: (data: GuestInfo) => void;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

type FormField = keyof GuestInfo;

// Fixed FormError type declaration
type FormError = Partial<Record<FormField, string>>;

const INITIAL_GUEST_INFO: GuestInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialRequests: '',
};

const GuestForm: React.FC<GuestFormProps> = ({ bookingDetails, onNext }) => {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>(INITIAL_GUEST_INFO);
  const [errors, setErrors] = useState<FormError>({});
  const [touched, setTouched] = useState<Set<FormField>>(new Set());


  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);
  };

  const validateField = useCallback((name: FormField, value: string): string => {
    if (name === 'specialRequests') return ''; // Special requests are optional

    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'First name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last name is required';
      case 'email':
        return validateEmail(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        return validatePhone(value) ? '' : 'Please enter a valid phone number';
      default:
        return '';
    }
  }, []);

  const handleChange = useCallback((name: FormField, value: string) => {
    setGuestInfo(prev => ({ ...prev, [name]: value }));
    if (touched.has(name)) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: FormField) => {
    setTouched(prev => new Set(prev).add(name));
    const value = guestInfo[name];
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  }, [guestInfo, validateField]);

  const validateForm = (): boolean => {
    const newErrors: FormError = {};
    let isValid = true;

    // Only validate required fields
    const requiredFields: FormField[] = ['firstName', 'lastName', 'email', 'phone'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, guestInfo[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (!isValid) {
      const firstError = Object.values(newErrors)[0];
      Alert.alert('Validation Error', firstError);
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(guestInfo);
    }
  };

  const renderInput = (
    name: FormField,
    label: string,
    placeholder: string,
    options: Partial<TextInput['props']> = {}
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          errors[name] ? styles.inputError : null,
          touched.has(name) && !errors[name] ? styles.inputValid : null,
        ]}
        value={guestInfo[name]}
        onChangeText={(text) => handleChange(name, text)}
        onBlur={() => handleBlur(name)}
        placeholder={placeholder}
        placeholderTextColor="#999"
        {...options}
      />
      {errors[name] && touched.has(name) && (
        <Text style={styles.errorText}>{errors[name]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Primary Guest Information</Text>
          
          {renderInput('firstName', 'First Name', 'Enter your first name', {
            autoCapitalize: 'words',
            returnKeyType: 'next',
          })}

          {renderInput('lastName', 'Last Name', 'Enter your last name', {
            autoCapitalize: 'words',
            returnKeyType: 'next',
          })}

          {renderInput('email', 'Email', 'Enter your email', {
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            returnKeyType: 'next',
          })}

          {renderInput('phone', 'Phone Number', 'Enter your phone number', {
            keyboardType: 'phone-pad',
            returnKeyType: 'next',
          })}

          {renderInput('specialRequests', 'Special Requests (Optional)', 'Any special requests?', {
            multiline: true,
            numberOfLines: 3,
            textAlignVertical: 'top',
            returnKeyType: 'done',
          })}

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={Colors.light.primary} />
            <Text style={styles.infoText}>
              Please ensure your contact details are correct. Your booking confirmation will be sent to the provided email address.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
    minHeight: 48, 
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff8f8',
  },
  inputValid: {
    borderColor: '#4CAF50',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GuestForm;