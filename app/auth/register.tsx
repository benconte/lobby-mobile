import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Alert,
  ViewStyle,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./_styles/register";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

interface FormErrors {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
}

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { signUp, error: authError } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    };

    // First Name validation
    if (!firstName) {
      newErrors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!lastName) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return (
      !newErrors.firstName &&
      !newErrors.lastName &&
      !newErrors.email &&
      !newErrors.password
    );
  };

  const getInputStyle = (errorKey: keyof FormErrors): ViewStyle[] => {
    const baseStyle = styles.input as ViewStyle;
    const errorStyle = styles.inputError as ViewStyle;
    return [baseStyle, errors[errorKey] ? errorStyle : {}];
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp({
        firstName,
        lastName,
        email: email.trim(),
        password,
      });
      router.push("/(app)/(tabs)/");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        authError || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleSocialLogin = (provider: "google" | "apple") => {
    Alert.alert(
      "Social Login",
      `${provider} registration will be implemented soon!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior="height"
          contentContainerStyle={styles.scrollView}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            // style={styles.scrollView}
            style={{marginTop: 100}}
            contentContainerStyle={styles.scrollViewContent}
          >
            <StatusBar barStyle="dark-content" />
            <View style={styles.content}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us! We're excited to have you.
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={getInputStyle("firstName")}
                  placeholder="First Name"
                  placeholderTextColor="#999"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={getInputStyle("lastName")}
                  placeholder="Last Name"
                  placeholderTextColor="#999"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={getInputStyle("email")}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={getInputStyle("password")}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.signInButton,
                  isSubmitting && (styles.signInButtonDisabled as ViewStyle),
                ]}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signInText}>Sign up</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.createAccount}>
                  Already have an account? Log in
                </Text>
              </TouchableOpacity>

              <Text style={styles.continueWith}>Or continue with</Text>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin("google")}
                >
                  <Ionicons
                    name="logo-google"
                    size={24}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin("apple")}
                >
                  <Ionicons name="logo-apple" size={24} color="#000" />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Register;
