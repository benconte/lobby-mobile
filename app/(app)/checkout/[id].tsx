import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import GuestForm from "@/components/checkout/GuestForm";
import Preferences from "@/components/checkout/Preference";
import Payment from "@/components/checkout/Payment";
import ReviewBooking from "@/components/checkout/ReviewBooking";
import RoomSelection from "@/components/checkout/RoomSelection";
import {
  CheckoutStepType,
  CHECKOUT_STEPS,
  BookingData,
  HotelDetails,
  BookingDetails,
  Room,
  GuestInfo,
  BookingPreferences,
  PaymentInfo,
  ReviewBookingData,
} from "@/types/booking";

const { width } = Dimensions.get("window");

export default function Checkout() {
  const params = useLocalSearchParams<{
    id: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
    hotelName?: string;
    price?: string;
  }>();
  const router = useRouter();
  const bookingDataRef = useRef<BookingData>({
    rooms: undefined,
    guestInfo: undefined,
    preferences: undefined,
    paymentMethod: undefined,
  });

  const [currentStep, setCurrentStep] = useState<CheckoutStepType>("rooms");
  const [bookingData, setBookingData] = useState<BookingData>(bookingDataRef.current);
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotelDetails();
  }, [params.id]);

  const fetchHotelDetails = async () => {
    if (!params.id) {
      setError("Missing hotel ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.yelp.com/v3/businesses/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_YELP_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
      }

      const data = await response.json();
      setHotelDetails(data);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      setError("Failed to load hotel details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBookingDetails = useCallback((): BookingDetails => {
    if (!params.checkIn || !params.checkOut || !params.adults || !params.children) {
      throw new Error("Missing required booking parameters");
    }

    return {
      checkIn: new Date(params.checkIn),
      checkOut: new Date(params.checkOut),
      guests: {
        adults: Number(params.adults),
        children: Number(params.children),
      },
      nights: Math.ceil(
        (new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      ),
      guestInfo: bookingDataRef.current.guestInfo,
      rooms: bookingDataRef.current.rooms,
      preferences: bookingDataRef.current.preferences,
      paymentMethod: bookingDataRef.current.paymentMethod,
    };
  }, [params, bookingDataRef.current]);

  const validateCurrentStep = (data: Room | GuestInfo | BookingPreferences | PaymentInfo): boolean => {
    switch (currentStep) {
      case 'rooms':
        return !!data;
      case 'guest-info':
        const guestInfo = data as GuestInfo;
        return !!(
          guestInfo.firstName?.trim() &&
          guestInfo.lastName?.trim() &&
          guestInfo.email?.trim() &&
          guestInfo.phone?.trim()
        );
      case 'preferences':
        return true;
      case 'payment':
        const paymentInfo = data as PaymentInfo;
        if (!paymentInfo.paymentMethod) return false;
        
        if (['visa', 'mastercard'].includes(paymentInfo.paymentMethod)) {
          return true;
        }
        
        if (paymentInfo.paymentMethod === 'new-card') {
          return !!(
            paymentInfo.cardDetails?.number &&
            paymentInfo.cardDetails?.expiry &&
            paymentInfo.cardDetails?.cvv &&
            paymentInfo.cardDetails?.name
          );
        }
        return false;
      default:
        return true;
    }
  };

  const handleNext = useCallback((data: Room | GuestInfo | BookingPreferences | PaymentInfo) => {
    if (!validateCurrentStep(data)) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required information for this step."
      );
      return;
    }

    // Update booking data
    const newBookingData = { ...bookingDataRef.current };
    switch (currentStep) {
      case 'rooms':
        newBookingData.rooms = data as Room;
        break;
      case 'guest-info':
        newBookingData.guestInfo = data as GuestInfo;
        break;
      case 'preferences':
        newBookingData.preferences = data as BookingPreferences;
        break;
      case 'payment':
        newBookingData.paymentMethod = data as PaymentInfo;
        break;
    }

    // Update both state and ref
    bookingDataRef.current = newBookingData;
    setBookingData(newBookingData);

    // Move to next step
    const currentIndex = CHECKOUT_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex < CHECKOUT_STEPS.length - 1) {
      setCurrentStep(CHECKOUT_STEPS[currentIndex + 1].id);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    const currentIndex = CHECKOUT_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(CHECKOUT_STEPS[currentIndex - 1].id);
    } else {
      router.back();
    }
  }, [currentStep]);

  const handleConfirmBooking = useCallback(async () => {
    try {
      setLoading(true);
      const currentBookingData = bookingDataRef.current;

      if (
        !currentBookingData.rooms ||
        !currentBookingData.guestInfo ||
        !currentBookingData.preferences ||
        !currentBookingData.paymentMethod
      ) {
        throw new Error("Missing required booking information");
      }

      const bookingPayload = {
        hotelId: params.id,
        ...getBookingDetails(),
        ...currentBookingData,
      };

      // TODO: Send to backend
      // const response = await createBooking(bookingPayload);

      router.push({
        pathname: "/booking-confirmation",
        params: {
          bookingId: `BOOK-${Date.now()}`,
          hotelName: hotelDetails?.name,
          checkIn: params.checkIn,
          checkOut: params.checkOut,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [params, hotelDetails]);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View style={styles.stepIndicator}>
        {CHECKOUT_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  currentStep === step.id && styles.stepDotActive,
                  CHECKOUT_STEPS.findIndex((s) => s.id === currentStep) > index &&
                    styles.stepDotCompleted,
                ]}
              />
              <Text
                style={[
                  styles.stepText,
                  currentStep === step.id && styles.stepTextActive,
                ]}
                numberOfLines={1}
              >
                {step.shortTitle}
              </Text>
            </View>
            {index < CHECKOUT_STEPS.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  CHECKOUT_STEPS.findIndex((s) => s.id === currentStep) > index &&
                    styles.stepLineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    const bookingDetails = getBookingDetails();

    switch (currentStep) {
      case "rooms":
        return (
          <RoomSelection
            bookingDetails={bookingDetails}
            hotelDetails={hotelDetails}
            onNext={handleNext}
          />
        );
      case "guest-info":
        return <GuestForm bookingDetails={bookingDetails} onNext={handleNext} />;
      case "preferences":
        return <Preferences bookingDetails={bookingDetails} onNext={handleNext} />;
      case "payment":
        return <Payment bookingDetails={bookingDetails} onNext={handleNext} />;
      case "review":
        const currentBookingData = bookingDataRef.current;
        
        if (
          !currentBookingData.rooms ||
          !currentBookingData.guestInfo ||
          !currentBookingData.preferences ||
          !currentBookingData.paymentMethod ||
          !hotelDetails
        ) {
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Missing required booking information. Please go back and complete all steps.
              </Text>
            </View>
          );
        }

        const reviewData: ReviewBookingData = {
          rooms: currentBookingData.rooms,
          guestInfo: currentBookingData.guestInfo,
          preferences: currentBookingData.preferences,
          paymentMethod: currentBookingData.paymentMethod,
        };

        return (
          <ReviewBooking
            bookingDetails={bookingDetails}
            bookingData={reviewData}
            hotelDetails={hotelDetails}
            onConfirm={handleConfirmBooking}
          />
        );
      default:
        return null;
    }
  };

  if (loading && !hotelDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchHotelDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle:
            CHECKOUT_STEPS.find((step) => step.id === currentStep)?.title ||
            "Checkout",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        {hotelDetails && (
          <View style={styles.summary}>
            <Text style={styles.hotelName}>{hotelDetails.name}</Text>
            <Text style={styles.bookingDates}>
              {new Date(params.checkIn).toLocaleDateString()} -{" "}
              {new Date(params.checkOut).toLocaleDateString()}
            </Text>
            <Text style={styles.guests}>
              {params.adults} Adults, {params.children} Children
            </Text>
          </View>
        )}

        {renderStepIndicator()}
        <View style={styles.content}>{renderCurrentStep()}</View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  headerButton: {
    padding: 10,
  },
  summary: {
    padding: 20,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  hotelName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bookingDates: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
  },
  guests: {
    fontSize: 16,
    color: "#666",
  },
  stepIndicatorContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  stepItem: {
    flex: 1,
    alignItems: "center",
    maxWidth: width / CHECKOUT_STEPS.length,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginBottom: 6,
  },
  stepDotActive: {
    backgroundColor: Colors.light.primary,
    transform: [{ scale: 1.2 }],
  },
  stepDotCompleted: {
    backgroundColor: Colors.light.primary,
  },
  stepText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  stepTextActive: {
    color: Colors.light.primary,
    fontWeight: "500",
  },
  stepLine: {
    flex: 0,
    height: 1,
    width: 15,
    backgroundColor: "#ddd",
    marginHorizontal: 2,
  },
  stepLineCompleted: {
    backgroundColor: Colors.light.primary,
  },
  content: {
    flex: 1,
  },
});
