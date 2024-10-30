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
} from "react-native";
import React, { useState } from "react";
import { styles } from "./_styles/register";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <StatusBar barStyle="dark-content" />
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us! We're excited to have you.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
            />
            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.createAccount}>Already have an account? Log in</Text>
            </TouchableOpacity>
            <Text style={styles.continueWith}>Or continue with</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color={Colors.light.primary} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
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

export default Register;