// src/screens/auth/Login.tsx

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
  TextStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./_styles/login";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import axios, { AxiosError } from "axios";

// Define the shape of our errors object
interface FormErrors {
  email: string | null;
  password: string | null;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({
    email: null,
    password: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { login, error: authError } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      email: null,
      password: null
    };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Helper function to get input style
  const getInputStyle = (errorKey: keyof FormErrors): ViewStyle[] => {
    const baseStyle = styles.input as ViewStyle;
    const errorStyle = styles.inputError as ViewStyle;
    return [
      baseStyle,
      errors[errorKey] ? errorStyle : {}
    ];
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login({
        email: email.trim(),
        password,
      });
      router.push("/(app)/(tabs)/");
    } catch (error) {
      // if (error instanceof AxiosError) {
      //   console.log(error.response?.data)
      // }
      Alert.alert(
        "Login Failed",
        authError || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  const handleForgotPassword = () => {
    // router.push("/auth/forgot-password");
  };

  const handleSocialLogin = (provider: "google" | "apple") => {
    Alert.alert(
      "Social Login",
      `${provider} login will be implemented soon!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <StatusBar barStyle="dark-content" />
          <View style={styles.content}>
            <Text style={styles.title}>Login here</Text>
            <Text style={styles.subtitle}>
              Welcome back you've been missed!
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={getInputStyle('email')}
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
                style={getInputStyle('password')}
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

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.signInButton,
                isSubmitting && styles.signInButtonDisabled as ViewStyle
              ]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInText}>Sign in</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.createAccount}>Create new account</Text>
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;
