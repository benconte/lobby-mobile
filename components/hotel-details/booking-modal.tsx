import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface BookingModalProps {
  visible: boolean;
  hotelId: string;
  onClose: () => void;
  hotelName: string;
  pricePerNight: number;
}

interface GuestCount {
  adults: number;
  children: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  hotelId,
  hotelName,
  pricePerNight,
}) => {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [guests, setGuests] = useState<GuestCount>({ adults: 1, children: 0 });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<"checkIn" | "checkOut">(
    "checkIn"
  );
  const router = useRouter();
  const calculateNights = () => {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomCost = nights * pricePerNight;
    const taxes = roomCost * 0.15; // 15% tax
    const serviceFee = 25; // Fixed service fee
    return {
      roomCost,
      taxes,
      serviceFee,
      total: roomCost + taxes + serviceFee,
    };
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      if (datePickerMode === "checkIn") {
        setCheckIn(selectedDate);
        // Ensure checkout is after checkin
        if (selectedDate >= checkOut) {
          const newCheckOut = new Date(selectedDate);
          newCheckOut.setDate(newCheckOut.getDate() + 1);
          setCheckOut(newCheckOut);
        }
      } else {
        setCheckOut(selectedDate);
      }
    }
  };

  const handleGuestChange = (
    type: "adults" | "children",
    increment: boolean
  ) => {
    setGuests((prev) => ({
      ...prev,
      [type]: increment
        ? prev[type] + 1
        : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const costs = calculateTotal();

  const handleConfirmBooking = () => {
    // Close the modal first
    onClose();

    // Navigate to checkout with all necessary params
    router.push({
      pathname: `/(app)/checkout/[id]`,
      params: {
        id: hotelId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        adults: guests.adults,
        children: guests.children,
        price: pricePerNight,
        hotelName: encodeURIComponent(hotelName),
      },
    });
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book your stay</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Hotel Name */}
          <Text style={styles.hotelName}>{hotelName}</Text>

          {/* Dates Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Dates</Text>
            <View style={styles.datesContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  setDatePickerMode("checkIn");
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.dateLabel}>Check-in</Text>
                <Text style={styles.dateValue}>{formatDate(checkIn)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  setDatePickerMode("checkOut");
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.dateLabel}>Check-out</Text>
                <Text style={styles.dateValue}>{formatDate(checkOut)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Guests Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guests</Text>
            <View style={styles.guestTypeContainer}>
              <View>
                <Text style={styles.guestTypeLabel}>Adults</Text>
                <Text style={styles.guestTypeSubLabel}>Age 13+</Text>
              </View>
              <View style={styles.guestCountContainer}>
                <TouchableOpacity
                  style={[
                    styles.guestButton,
                    guests.adults === 1 && styles.guestButtonDisabled,
                  ]}
                  onPress={() => handleGuestChange("adults", false)}
                  disabled={guests.adults === 1}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={guests.adults === 1 ? "#ccc" : "black"}
                  />
                </TouchableOpacity>
                <Text style={styles.guestCount}>{guests.adults}</Text>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => handleGuestChange("adults", true)}
                >
                  <Ionicons name="add" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.guestTypeContainer}>
              <View>
                <Text style={styles.guestTypeLabel}>Children</Text>
                <Text style={styles.guestTypeSubLabel}>Age 0-12</Text>
              </View>
              <View style={styles.guestCountContainer}>
                <TouchableOpacity
                  style={[
                    styles.guestButton,
                    guests.children === 0 && styles.guestButtonDisabled,
                  ]}
                  onPress={() => handleGuestChange("children", false)}
                  disabled={guests.children === 0}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={guests.children === 0 ? "#ccc" : "black"}
                  />
                </TouchableOpacity>
                <Text style={styles.guestCount}>{guests.children}</Text>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => handleGuestChange("children", true)}
                >
                  <Ionicons name="add" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Price Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                ${pricePerNight} × {calculateNights()} nights
              </Text>
              <Text style={styles.priceValue}>${costs.roomCost}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes (15%)</Text>
              <Text style={styles.priceValue}>${costs.taxes.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>${costs.serviceFee}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${costs.total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmBooking}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker &&
          (Platform.OS === "ios" ? (
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.datePickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={datePickerMode === "checkIn" ? checkIn : checkOut}
                mode="date"
                display="inline"
                minimumDate={
                  datePickerMode === "checkOut" ? checkIn : new Date()
                }
                onChange={handleDateChange}
                textColor="black" // Add this to make text visible
                accentColor={Colors.light.primary} // Add this for selected date color
                themeVariant="light" // Add this to ensure light theme
                style={styles.datePickerIOS}
              />
            </View>
          ) : (
            <DateTimePicker
              value={datePickerMode === "checkIn" ? checkIn : checkOut}
              mode="date"
              display="default"
              minimumDate={datePickerMode === "checkOut" ? checkIn : new Date()}
              onChange={handleDateChange}
            />
          ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginRight: 30,
  },
  content: {
    flex: 1,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  guestTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  guestTypeLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  guestTypeSubLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  guestCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestButton: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 17.5,
    alignItems: "center",
    justifyContent: "center",
  },
  guestButtonDisabled: {
    borderColor: "#eee",
  },
  guestCount: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: {
    color: "#666",
  },
  priceValue: {
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  datePickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  datePickerCancel: {
    color: "#666",
    fontSize: 16,
  },
  datePickerDone: {
    color: Colors.light.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  datePickerIOS: {
    backgroundColor: "white",
    height: 340,
    // Add padding to prevent calendar from touching the edges
    marginHorizontal: 10,
  },
});

export default BookingModal;
