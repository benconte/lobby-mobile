import React, { useState, useCallback, useMemo } from "react";
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
  PaymentProps,
  PaymentMethod,
  PaymentInfo,
  CardDetails,
} from "@/types/booking";

// Move to constants in real app
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "visa",
    name: "Visa",
    icon: "🏦",
    last4: "4242",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    icon: "💳",
    last4: "8888",
  },
  {
    id: "new-card",
    name: "Add New Card",
    icon: "➕",
  },
];

interface PriceBreakdown {
  roomTotal: number;
  taxes: number;
  fees: number;
  total: number;
}

const Payment: React.FC<PaymentProps> = ({ bookingDetails, onNext }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>(
    bookingDetails.paymentMethod?.paymentMethod || ""
  );
  const [showNewCard, setShowNewCard] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expiry: "",
    cvv: "",
    name: bookingDetails.guestInfo
      ? `${bookingDetails.guestInfo.firstName} ${bookingDetails.guestInfo.lastName}`
      : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = useMemo((): PriceBreakdown => {
    if (!bookingDetails.rooms?.price) {
      return {
        roomTotal: 0,
        taxes: 0,
        fees: 25,
        total: 25, // Just the service fee
      };
    }

    const roomTotal = bookingDetails.rooms.price * bookingDetails.nights;
    const taxes = roomTotal * 0.15;
    const fees = 25;

    return {
      roomTotal,
      taxes,
      fees,
      total: roomTotal + taxes + fees,
    };
  }, [bookingDetails.rooms?.price, bookingDetails.nights]);

  const handlePaymentMethodSelect = useCallback((methodId: string) => {
    setSelectedMethod(methodId);
    setShowNewCard(methodId === "new-card");
  }, []);

  const formatCardNumber = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  }, []);

  const formatExpiry = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  }, []);

  const validateCardDetails = useCallback((): boolean => {
    if (!showNewCard) return true;

    if (
      !cardDetails.number ||
      cardDetails.number.replace(/\s/g, "").length !== 16
    ) {
      Alert.alert("Invalid Card", "Please enter a valid 16-digit card number");
      return false;
    }

    if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
      Alert.alert("Invalid Expiry", "Please enter a valid expiry date (MM/YY)");
      return false;
    }

    const [month, year] = cardDetails.expiry.split("/");
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiry < new Date()) {
      Alert.alert("Invalid Expiry", "Card has expired");
      return false;
    }

    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      Alert.alert("Invalid CVV", "Please enter a valid 3-digit CVV");
      return false;
    }

    if (!cardDetails.name.trim()) {
      Alert.alert("Invalid Name", "Please enter the cardholder name");
      return false;
    }

    return true;
  }, [showNewCard, cardDetails]);

  const handleSubmit = useCallback(async () => {
  if (!selectedMethod) {
    Alert.alert('Selection Required', 'Please select a payment method');
    return;
  }

  try {
    // Always use guest info for billing
    const paymentData: PaymentInfo = {
      paymentMethod: selectedMethod,
      billingInfo: {
        firstName: bookingDetails.guestInfo?.firstName || '',
        lastName: bookingDetails.guestInfo?.lastName || '',
        email: bookingDetails.guestInfo?.email || '',
        phone: bookingDetails.guestInfo?.phone || '',
      }
    };

    if (selectedMethod === 'new-card') {
      if (!validateCardDetails()) {
        return;
      }
      paymentData.cardDetails = cardDetails;
    } else {
      // For saved cards
      const savedCard = PAYMENT_METHODS.find(method => method.id === selectedMethod);
      if (savedCard?.last4) {
        paymentData.cardDetails = {
          number: `**** **** **** ${savedCard.last4}`,
          expiry: '**/**',
          cvv: '***',
          name: `${bookingDetails.guestInfo?.firstName} ${bookingDetails.guestInfo?.lastName}`,
          last4: savedCard.last4
        };
      }
    }

    onNext(paymentData);
  } catch (error) {
    Alert.alert('Error', 'Failed to process payment information. Please try again.');
    console.error('Payment error:', error);
  }
}, [selectedMethod, cardDetails, bookingDetails.guestInfo, validateCardDetails]);

  const renderPaymentMethod = useCallback(
    ({ id, name, icon, last4 }: PaymentMethod) => (
      <TouchableOpacity
        key={id}
        style={[
          styles.methodItem,
          selectedMethod === id && styles.methodItemSelected,
        ]}
        onPress={() => handlePaymentMethodSelect(id)}
        activeOpacity={0.7}
      >
        <Text style={styles.methodIcon}>{icon}</Text>
        <View style={styles.methodInfo}>
          <Text style={styles.methodName}>{name}</Text>
          {last4 && (
            <Text style={styles.methodDetails}>**** **** **** {last4}</Text>
          )}
        </View>
        <Ionicons
          name={
            selectedMethod === id
              ? "checkmark-circle"
              : "checkmark-circle-outline"
          }
          size={24}
          color={selectedMethod === id ? Colors.light.primary : "#ddd"}
        />
      </TouchableOpacity>
    ),
    [selectedMethod, handlePaymentMethodSelect]
  );

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
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.subtitle}>
            Choose your preferred payment method
          </Text>

          <View style={styles.paymentMethods}>
            {PAYMENT_METHODS.map(renderPaymentMethod)}
          </View>

          {showNewCard && (
            <View style={styles.newCardForm}>
              <Text style={styles.formTitle}>Add New Card</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                  value={cardDetails.number}
                  onChangeText={(text) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      number: formatCardNumber(text),
                    }))
                  }
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                    value={cardDetails.expiry}
                    onChangeText={(text) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        expiry: formatExpiry(text),
                      }))
                    }
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={3}
                    value={cardDetails.cvv}
                    onChangeText={(text) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        cvv: text,
                      }))
                    }
                    placeholderTextColor="#999"
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChangeText={(text) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      name: text,
                    }))
                  }
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          {selectedMethod && bookingDetails.guestInfo && (
            <View style={styles.billingSummary}>
              <Text style={styles.formTitle}>Payment Summary</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Room Total</Text>
                <Text style={styles.priceValue}>
                  ${totalAmount.roomTotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Taxes (15%)</Text>
                <Text style={styles.priceValue}>
                  ${totalAmount.taxes.toFixed(2)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service Fee</Text>
                <Text style={styles.priceValue}>
                  ${totalAmount.fees.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${totalAmount.total.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.secureInfo}>
            <Ionicons
              name="lock-closed"
              size={20}
              color={Colors.light.primary}
            />
            <Text style={styles.secureText}>
              Your payment information is secure and encrypted. We never store
              complete card details.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedMethod || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedMethod || isSubmitting}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting
              ? "Processing..."
              : `Pay $${totalAmount.total.toFixed(2)}`}
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
    color: "#333",
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  paymentMethods: {
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },
  methodItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}10`,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  methodDetails: {
    color: "#666",
    fontSize: 14,
    marginTop: 2,
  },
  newCardForm: {
    marginTop: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "white",
  },
  billingSummary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
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
    color: "#333",
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  secureInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    gap: 10,
  },
  secureText: {
    flex: 1,
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cardIcon: {
    width: 40,
    height: 25,
    marginRight: 10,
  },
  secureFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 5,
  },
  secureFooterText: {
    color: "#666",
    fontSize: 12,
  },
  billingInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  billingInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  billingInfoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  billingInfoDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  cardNumberContainer: {
    position: "relative",
  },
  cardTypeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});

export default Payment;
