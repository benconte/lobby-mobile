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
import React, {useState} from "react";
import { styles } from "./_styles/login";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    router.push('/(app)/(tabs)/');
  };

  const handleRegister = () => {
    router.push('/auth/register');
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
            <Text style={styles.title}>Login here</Text>
            <Text style={styles.subtitle}>
              Welcome back you've been missed!
            </Text>

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

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.createAccount}>Create new account</Text>
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

export default Login;
