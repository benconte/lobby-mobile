import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./_styles/welcome";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/welcome.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Discover your dream hotel here</Text>
        <Text style={styles.subText}>
          Whether you're looking for a cozy retreat, a luxurious getaway, or a
          family-friendly destination, we've got you covered.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.secondary }]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
