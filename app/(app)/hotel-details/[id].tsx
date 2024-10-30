import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import BookingModal from "@/components/hotel-details/booking-modal";

// First, let's define our types
interface Amenity {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
}

interface HotelDetails {
  id: string;
  name: string;
  image_url: string;
  location: {
    address1: string;
    city: string;
    state: string;
  };
  price: string;
  rating: number;
  review_count: number;
  categories: Array<{ title: string }>;
}

// Define comprehensive amenities list
const amenities: Amenity[] = [
  { icon: "car", name: "Parking" },
  { icon: "wifi", name: "Free Wifi" },
  { icon: "shirt", name: "Laundry" },
  { icon: "thermometer", name: "AC" },
  { icon: "wine", name: "Bar" },
  { icon: "restaurant", name: "Restaurant" },
  { icon: "fitness", name: "Gym" },
  { icon: "water", name: "Pool" },
  { icon: "bed", name: "King Bed" },
  { icon: "tv", name: "Smart TV" },
  { icon: "cafe", name: "Breakfast" },
  { icon: "business", name: "Business" },
  { icon: "snow", name: "Mini Bar" },
  { icon: "key", name: "24/7 Access" },
  { icon: "medkit", name: "First Aid" },
];

const HotelDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://api.yelp.com/v3/businesses/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_YELP_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
      }

      const data = await response.json();
      setHotel(data);
    } catch (err) {
      console.error("Error fetching hotel details:", err);
      setError("Failed to load hotel details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (error || !hotel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Hotel not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchHotelDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatPrice = (price?: string) => {
    if (!price) return 15;
    return price.length * 25;
  };

  // Randomly select 5-8 amenities to display
  const getRandomAmenities = () => {
    const shuffled = [...amenities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 5);
  };

  const displayAmenities = getRandomAmenities();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Image Section with Back Button */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: hotel.image_url || "https://placehold.co/600x400.png",
            }}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Hotel Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{hotel.name}</Text>
              <Text style={styles.location}>
                {`${hotel.location.address1}, ${hotel.location.city}`}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${formatPrice(hotel.price)}</Text>
              <Text style={styles.perNight}>/Night</Text>
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <View style={styles.typeContainer}>
              <Text style={styles.typeText}>
                {hotel.categories[0]?.title || "Hotel"}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{hotel.rating}</Text>
              <Ionicons name="star" size={16} color={Colors.light.primary} />
              <Text style={styles.reviews}>{hotel.review_count} Reviews</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              Experience luxury and comfort at {hotel.name}, located in the
              heart of {hotel.location.city}. Our{" "}
              {hotel.categories[0]?.title.toLowerCase()} offers modern amenities
              and exceptional service, making it perfect for both business and
              leisure travelers. Enjoy easy access to local attractions and a
              comfortable stay with our well-appointed rooms.
            </Text>
          </View>

          {/* Amenities Section */}
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {displayAmenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={styles.amenityIconContainer}>
                    <Ionicons
                      name={amenity.icon}
                      size={24}
                      color={Colors.light.primary}
                    />
                  </View>
                  <Text style={styles.amenityText}>{amenity.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bookmarkButton} activeOpacity={0.7}>
          <Ionicons
            name="bookmark-outline"
            size={24}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow} activeOpacity={0.7}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

        <BookingModal
          visible={showBookingModal}
          onClose={handleCloseBooking}
          hotelId={hotel.id}
          hotelName={hotel.name}
          pricePerNight={formatPrice(hotel.price)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  priceContainer: {
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  perNight: {
    color: "#666",
    fontSize: 14,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  typeContainer: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  typeText: {
    color: Colors.light.primary,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rating: {
    fontWeight: "bold",
  },
  reviews: {
    color: "#666",
  },
  descriptionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: "#666",
    lineHeight: 24,
  },
  amenitiesContainer: {
    marginTop: 20,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  amenityItem: {
    alignItems: "center",
    width: 80,
  },
  amenityIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: Colors.light.background,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  amenityText: {
    color: "#666",
    fontSize: 12,
  },
  bottomContainer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  bookmarkButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  bookButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: "white",
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
});

export default HotelDetails;
