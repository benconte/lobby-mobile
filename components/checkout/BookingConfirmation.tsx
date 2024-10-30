import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function BookingConfirmation() {
  const router = useRouter();
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewBooking = () => {
    router.push('/trips');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: scaleValue }],
              },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={100}
              color={Colors.light.primary}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.messageContainer,
              {
                opacity: fadeValue,
              },
            ]}
          >
            <Text style={styles.title}>Booking Confirmed!</Text>
            <Text style={styles.subtitle}>
              Your reservation has been successfully confirmed
            </Text>

            <View style={styles.bookingInfo}>
              <Text style={styles.infoLabel}>Booking Reference</Text>
              <Text style={styles.infoValue}>
                #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </Text>
            </View>

            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>What's Next?</Text>
              <View style={styles.stepItem}>
                <Ionicons name="mail" size={24} color={Colors.light.primary} />
                <View style={styles.stepText}>
                  <Text style={styles.stepTitle}>Check Your Email</Text>
                  <Text style={styles.stepDescription}>
                    We've sent a confirmation email with all your booking details
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <Ionicons name="bed" size={24} color={Colors.light.primary} />
                <View style={styles.stepText}>
                  <Text style={styles.stepTitle}>Prepare for Your Stay</Text>
                  <Text style={styles.stepDescription}>
                    Review hotel policies and check-in instructions in your email
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <Ionicons name="help-circle" size={24} color={Colors.light.primary} />
                <View style={styles.stepText}>
                  <Text style={styles.stepTitle}>Need Help?</Text>
                  <Text style={styles.stepDescription}>
                    Contact our support team or the hotel directly for assistance
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewBooking}
          >
            <Text style={styles.primaryButtonText}>View Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBackToHome}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  messageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  bookingInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 15,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});