import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Room } from "@/types/booking";
import RoomComparisonModal from "./RoomComparisonModal";
import { roomTypes } from "@/config/constants";
import { RoomAmenity, RoomSelectionProps } from "@/types/booking";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 40; // 20px padding on each side

const RoomSelection: React.FC<RoomSelectionProps> = ({
  bookingDetails,
  hotelDetails,
  onNext,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(
    bookingDetails.rooms?.id || null
  );
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Filter available rooms based on occupancy
  const availableRooms = useMemo(() => {
    const totalGuests =
      bookingDetails.guests.adults + bookingDetails.guests.children;
    return roomTypes.filter((room) => room.maxOccupancy >= totalGuests);
  }, [bookingDetails.guests]);

  // Calculate total price for the stay
  const calculateTotalPrice = useCallback(
    (price: number) => {
      return price * bookingDetails.nights;
    },
    [bookingDetails.nights]
  );

  const handleRoomSelect = useCallback(
    (roomId: string) => {
      setSelectedRoom(roomId);
      const isExpanded = expandedRoom === roomId;
      setExpandedRoom(isExpanded ? null : roomId);
    },
    [expandedRoom]
  );

  const handleContinue = useCallback(() => {
    if (!selectedRoom) {
      Alert.alert("Selection Required", "Please select a room to continue");
      return;
    }

    const room = roomTypes.find((r) => r.id === selectedRoom);
    if (room) {
      onNext(room);
    }
  }, [selectedRoom, onNext]);

  const renderAmenity = useCallback(
    ({ icon, name }: RoomAmenity) => (
      <View style={styles.amenityItem}>
        <Ionicons name={icon} size={24} color={Colors.light.primary} />
        <Text style={styles.amenityText}>{name}</Text>
      </View>
    ),
    []
  );

  const renderFeature = useCallback(
    (feature: string) => (
      <View style={styles.featureItem}>
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={Colors.light.primary}
        />
        <Text style={styles.featureText}>{feature}</Text>
      </View>
    ),
    []
  );

  const renderImage = useCallback(
    ({ item }: { item: string }) => (
      <Image
        source={{ uri: item }}
        style={styles.roomImage}
        defaultSource={require("@/assets/images/placeholder.png")}
      />
    ),
    []
  );

  const renderRoom = useCallback(
    ({ item: room }: { item: Room }) => {
      const isExpanded = expandedRoom === room.id;
      const isSelected = selectedRoom === room.id;
      const totalPrice = calculateTotalPrice(room.price);

      return (
        <TouchableOpacity
          style={[styles.roomCard, isSelected && styles.roomCardSelected]}
          onPress={() => handleRoomSelect(room.id)}
          activeOpacity={0.7}
        >
          <FlatList
            data={room.images}
            renderItem={renderImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item, index) => `${room.id}-image-${index}`}
          />

          <View style={styles.roomContent}>
            <View style={styles.roomHeader}>
              <View>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomSize}>
                  {room.size} · Up to {room.maxOccupancy} guests
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${room.price}</Text>
                <Text style={styles.perNight}>/night</Text>
                <Text style={styles.totalPrice}>
                  ${totalPrice} total for {bookingDetails.nights} nights
                </Text>
              </View>
            </View>

            <Text style={styles.roomDescription}>{room.description}</Text>

            <View style={styles.bedTypeContainer}>
              <Ionicons name="bed" size={20} color={Colors.light.primary} />
              <Text style={styles.bedType}>{room.bedType}</Text>
            </View>

            {isExpanded && (
              <>
                <View style={styles.amenitiesContainer}>
                  <Text style={styles.sectionTitle}>Room Amenities</Text>
                  <View style={styles.amenitiesGrid}>
                    {room.amenities.map((amenity, index) => (
                      <View key={index}>{renderAmenity(amenity)}</View>
                    ))}
                  </View>
                </View>

                <View style={styles.featuresContainer}>
                  <Text style={styles.sectionTitle}>Features</Text>
                  {room.features.map((feature, index) => (
                    <View key={index}>{renderFeature(feature)}</View>
                  ))}
                </View>

                <View style={styles.policyContainer}>
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.policyText}>
                    {room.cancellationPolicy}
                  </Text>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setExpandedRoom(isExpanded ? null : room.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.expandButtonText}>
                {isExpanded ? "Show less" : "Show more"}
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.light.primary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [
      expandedRoom,
      selectedRoom,
      calculateTotalPrice,
      bookingDetails.nights,
      handleRoomSelect,
    ]
  );

  if (availableRooms.length === 0) {
    return (
      <View style={styles.noRoomsContainer}>
        <Text style={styles.noRoomsText}>
          No rooms available for{" "}
          {bookingDetails.guests.adults + bookingDetails.guests.children}{" "}
          guests.
        </Text>
        <Text style={styles.noRoomsSubText}>
          Please modify your search or contact the hotel directly.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={availableRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />

      {selectedRoom && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => setShowComparison(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="git-compare"
              size={20}
              color={Colors.light.primary}
            />
            <Text style={styles.compareButtonText}>Compare Rooms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleContinue}
            activeOpacity={0.7}
          >
            <Text style={styles.selectButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      <RoomComparisonModal
        visible={showComparison}
        onClose={() => setShowComparison(false)}
        rooms={availableRooms}
        selectedRoomId={selectedRoom}
        onSelectRoom={(roomId) => {
          setSelectedRoom(roomId);
        }}
      />
    </View>
  );
};

export default RoomSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  roomCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  roomCardSelected: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  carouselContainer: {
    height: 200,
  },
  roomImage: {
    width: IMAGE_WIDTH,
    height: 200,
  },
  paginationDots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 4,
  },
  roomContent: {
    padding: 15,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  roomSize: {
    color: "#666",
    marginTop: 4,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  perNight: {
    color: "#666",
    fontSize: 12,
  },
  roomDescription: {
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  bedTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  bedType: {
    fontSize: 16,
    color: "#333",
  },
  amenitiesContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  amenityItem: {
    alignItems: "center",
    width: 80,
  },
  amenityText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#666",
  },
  policyContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 5,
  },
  expandButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
    gap: 15,
  },
  compareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    flex: 1,
    gap: 8,
  },
  compareButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  selectButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  noRoomsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noRoomsText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  noRoomsSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  totalPrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
