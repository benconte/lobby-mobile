import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {
  ReviewBookingProps,
  BookingSummary,
  PreferenceOption,
  Room,
} from '@/types/booking';

const PREFERENCES: Record<string, PreferenceOption> = {
  'early-checkin': {
    id: 'early-checkin',
    icon: 'time',
    title: 'Early Check-in',
    description: 'Subject to availability',
  },
  'late-checkout': {
    id: 'late-checkout',
    icon: 'time-outline',
    title: 'Late Check-out',
    description: 'Subject to availability',
  },
  'high-floor': {
    id: 'high-floor',
    icon: 'business',
    title: 'High Floor',
    description: 'Room on higher floors',
  },
  'quiet-room': {
    id: 'quiet-room',
    icon: 'moon',
    title: 'Quiet Room',
    description: 'Away from elevator and street noise',
  },
  'airport-transfer': {
    id: 'airport-transfer',
    icon: 'car',
    title: 'Airport Transfer',
    description: 'Additional charges apply',
  },
};

const ReviewBooking: React.FC<ReviewBookingProps> = ({
  bookingDetails,
  bookingData,
  hotelDetails,
  onConfirm,
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const bookingSummary = useMemo((): BookingSummary => {
    const roomTotal = bookingData.rooms.price * bookingDetails.nights;
    const taxes = roomTotal * 0.15;
    const fees = 25;

    return {
      hotel: {
        name: hotelDetails.name,
        address: hotelDetails.location.address1,
        image: hotelDetails.image_url,
      },
      dates: {
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        nights: bookingDetails.nights,
      },
      guests: bookingDetails.guests,
      room: {
        name: bookingData.rooms.name,
        price: bookingData.rooms.price,
      },
      pricing: {
        roomTotal,
        taxes,
        fees,
        total: roomTotal + taxes + fees,
      },
    };
  }, [bookingDetails, bookingData.rooms, hotelDetails]);

  const handleConfirm = () => {
    Alert.alert(
      'Confirm Booking',
      `Total amount: ${formatCurrency(bookingSummary.pricing.total)}. Would you like to proceed?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: onConfirm,
          style: 'default',
        },
      ]
    );
  };

  const renderPreference = (prefId: string) => {
    const preference = PREFERENCES[prefId];
    if (!preference) return null;

    return (
      <View key={prefId} style={styles.preferenceItem}>
        <Ionicons name={preference.icon} size={16} color={Colors.light.primary} />
        <Text style={styles.preferenceText}>{preference.title}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Hotel Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotel Details</Text>
          <View style={styles.hotelCard}>
            <Image
              source={{ uri: hotelDetails.image_url }}
              style={styles.hotelImage}
              defaultSource={require('@/assets/images/placeholder.png')}
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotelDetails.name}</Text>
              <Text style={styles.hotelAddress}>
                {hotelDetails.location.address1}
              </Text>
            </View>
          </View>
        </View>

        {/* Stay Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stay Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Check-in</Text>
                <Text style={styles.detailValue}>
                  {formatDate(bookingDetails.checkIn)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Check-out</Text>
                <Text style={styles.detailValue}>
                  {formatDate(bookingDetails.checkOut)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Guests</Text>
                <Text style={styles.detailValue}>
                  {bookingDetails.guests.adults} Adults,{' '}
                  {bookingDetails.guests.children} Children
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Length of Stay</Text>
                <Text style={styles.detailValue}>
                  {bookingDetails.nights}{' '}
                  {bookingDetails.nights === 1 ? 'Night' : 'Nights'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Room Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Details</Text>
          <View style={styles.roomCard}>
            <Text style={styles.roomType}>{bookingData.rooms.name}</Text>
            <Text style={styles.roomDescription}>
              {bookingData.rooms.description}
            </Text>
            <View style={styles.roomFeatures}>
              {bookingData.rooms.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Guest Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>
                {bookingData.guestInfo.firstName} {bookingData.guestInfo.lastName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{bookingData.guestInfo.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{bookingData.guestInfo.phone}</Text>
            </View>
          </View>
        </View>

        {/* Selected Preferences */}
        {bookingData.preferences.preferences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Preferences</Text>
            <View style={styles.preferencesCard}>
              {bookingData.preferences.preferences.map(renderPreference)}
              {bookingData.preferences.specialRequests && (
                <View style={styles.specialRequests}>
                  <Text style={styles.specialRequestsLabel}>
                    Special Requests:
                  </Text>
                  <Text style={styles.specialRequestsText}>
                    {bookingData.preferences.specialRequests}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentMethod}>
              <Ionicons name="card" size={24} color={Colors.light.primary} />
              <Text style={styles.paymentMethodText}>
                {bookingData.paymentMethod.paymentMethod === 'new-card'
                  ? `Card ending in ${bookingData.paymentMethod.cardDetails?.number.slice(-4)}`
                  : 'Saved Card'}
              </Text>
            </View>
            <View style={styles.costBreakdown}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>
                  Room Rate ({bookingDetails.nights} nights)
                </Text>
                <Text style={styles.costValue}>
                  {formatCurrency(bookingSummary.pricing.roomTotal)}
                </Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Taxes (15%)</Text>
                <Text style={styles.costValue}>
                  {formatCurrency(bookingSummary.pricing.taxes)}
                </Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Service Fee</Text>
                <Text style={styles.costValue}>
                  {formatCurrency(bookingSummary.pricing.fees)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(bookingSummary.pricing.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policyCard}>
          <Ionicons
            name="information-circle"
            size={20}
            color={Colors.light.primary}
          />
          <Text style={styles.policyText}>
            {bookingData.rooms.cancellationPolicy ||
              'Free cancellation until 24 hours before check-in. Cancellations after this time or no-shows will be charged the full amount.'}
          </Text>
        </View>
      </View>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmButtonText}>
            Confirm and Pay {formatCurrency(bookingSummary.pricing.total)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hotelCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  hotelImage: {
    width: '100%',
    height: 150,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  hotelAddress: {
    color: '#666',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  roomType: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  roomDescription: {
    color: '#666',
    marginBottom: 15,
  },
  roomFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  featureText: {
    color: '#666',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  preferencesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  preferenceText: {
    fontSize: 16,
  },
  specialRequests: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  specialRequestsLabel: {
    fontWeight: '600',
    marginBottom: 5,
  },
  specialRequestsText: {
    color: '#666',
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
  },
  costBreakdown: {
    marginTop: 15,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  costLabel: {
    color: '#666',
  },
  costValue: {
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  policyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    gap: 10,
  },
  policyText: {
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
  confirmButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewBooking;