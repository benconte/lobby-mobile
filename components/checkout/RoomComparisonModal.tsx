import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { RoomType } from "./RoomSelection";

interface RoomComparisonModalProps {
  visible: boolean;
  onClose: () => void;
  rooms: RoomType[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

const ROOM_COLUMN_WIDTH = 150;
const LABEL_COLUMN_WIDTH = 120;

const ComparisonRow = ({
  label,
  values,
  icon,
}: {
  label: string;
  values: string[];
  icon?: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={comparisonStyles.row}>
    <View style={comparisonStyles.labelContainer}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color="#666"
          style={comparisonStyles.labelIcon}
        />
      )}
      <Text style={comparisonStyles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
    {values.map((value, index) => (
      <View key={index} style={comparisonStyles.valueContainer}>
        <Text style={comparisonStyles.value} numberOfLines={2}>
          {value}
        </Text>
      </View>
    ))}
  </View>
);

const RoomComparisonModal: React.FC<RoomComparisonModalProps> = ({
  visible,
  onClose,
  rooms,
  selectedRoomId,
  onSelectRoom,
}) => {
  // Add ref for horizontal scroll
  const scrollViewRef = useRef<ScrollView | null>(null);

  // Add effect to scroll to selected room when modal opens
  useEffect(() => {
    if (visible && selectedRoomId) {
      const selectedIndex = rooms.findIndex(
        (room) => room.id === selectedRoomId
      );
      if (selectedIndex !== -1) {
        // Add a small delay to ensure the scroll happens after modal animation
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: (ROOM_COLUMN_WIDTH + 20) * selectedIndex, // width + horizontal margin
            animated: true,
          });
        }, 500);
      }
    }
  }, [visible, selectedRoomId]);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={comparisonStyles.container}>
        <View style={comparisonStyles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={comparisonStyles.closeButton}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={comparisonStyles.title}>Compare Rooms</Text>
        </View>

        <View style={comparisonStyles.roomsHeader}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={comparisonStyles.roomsHeaderContent}>
              {/* Remove the roomLabelSpacer */}
              {rooms.map((room) => (
                <View
                  key={room.id}
                  style={comparisonStyles.roomHeaderContainer}
                >
                  <Image
                    source={{ uri: room.images[0] }}
                    style={comparisonStyles.roomImage}
                    defaultSource={require("@/assets/images/placeholder.png")}
                  />
                  <Text style={comparisonStyles.roomName} numberOfLines={2}>
                    {room.name}
                  </Text>
                  <Text style={comparisonStyles.roomPrice}>
                    ${room.price}/night
                  </Text>
                  <TouchableOpacity
                    style={[
                      comparisonStyles.selectRoomButton,
                      selectedRoomId === room.id &&
                        comparisonStyles.selectedRoomButton,
                    ]}
                    onPress={() => {
                      onSelectRoom(room.id);
                      // Don't close modal here anymore
                    }}
                  >
                    <Text
                      style={[
                        comparisonStyles.selectRoomText,
                        selectedRoomId === room.id &&
                          comparisonStyles.selectedRoomText,
                      ]}
                    >
                      {selectedRoomId === room.id ? "Selected" : "Select"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView style={comparisonStyles.content}>
          <View style={comparisonStyles.comparisonTable}>
            <ComparisonRow
              label="Room Size"
              values={rooms.map((room) => room.size)}
              icon="resize"
            />

            <ComparisonRow
              label="Max Occupancy"
              values={rooms.map((room) => `${room.maxOccupancy} guests`)}
              icon="people"
            />

            <ComparisonRow
              label="Bed Type"
              values={rooms.map((room) => room.bedType)}
              icon="bed"
            />

            <View style={comparisonStyles.sectionTitle}>
              <Text style={comparisonStyles.sectionTitleText}>Amenities</Text>
            </View>

            {Array.from(
              new Set(
                rooms.flatMap((room) => room.amenities.map((a) => a.name))
              )
            ).map((amenity, index) => (
              <ComparisonRow
                key={index}
                label={amenity}
                values={rooms.map((room) =>
                  room.amenities.some((a) => a.name === amenity) ? "✓" : "–"
                )}
              />
            ))}

            <View style={comparisonStyles.sectionTitle}>
              <Text style={comparisonStyles.sectionTitleText}>Features</Text>
            </View>

            {Array.from(new Set(rooms.flatMap((room) => room.features))).map(
              (feature, index) => (
                <ComparisonRow
                  key={index}
                  label={feature}
                  values={rooms.map((room) =>
                    room.features.includes(feature) ? "✓" : "–"
                  )}
                />
              )
            )}

            <View style={comparisonStyles.sectionTitle}>
              <Text style={comparisonStyles.sectionTitleText}>Policies</Text>
            </View>

            <ComparisonRow
              label="Cancellation"
              values={rooms.map((room) => room.cancellationPolicy)}
              icon="calendar"
            />
          </View>
        </ScrollView>

        <View style={comparisonStyles.footer}>
          <TouchableOpacity
            style={comparisonStyles.doneButton}
            onPress={onClose}
          >
            <Text style={comparisonStyles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const comparisonStyles = StyleSheet.create({
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
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginRight: 30,
  },
  roomsHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  roomsHeaderContent: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingRight: 20,
  },
  roomLabelSpacer: {
    width: 120,
  },
  roomHeaderContainer: {
    width: ROOM_COLUMN_WIDTH,
    alignItems: "center",
    marginHorizontal: 10,
    paddingBottom: 10,
  },
  firstRoomContainer: {
    marginLeft: 20,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    textAlign: "center",
    paddingHorizontal: 5,
    width: "100%",
  },
  roomImage: {
    width: 130,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  roomPrice: {
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 10,
  },
  selectRoomButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  selectedRoomButton: {
    backgroundColor: Colors.light.primary,
  },
  selectRoomText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedRoomText: {
    color: "white",
  },
  content: {
    backgroundColor: "white",
  },
  comparisonTable: {
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    minHeight: 50,
  },
  labelContainer: {
    width: 120,
    paddingLeft: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#fafafa",
  },
  labelIcon: {
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    flexWrap: "wrap",
  },
  valueContainer: {
    width: 150,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 14,
    textAlign: "center",
    flexWrap: "wrap",
  },
  sectionTitle: {
    backgroundColor: Colors.light.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  doneButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RoomComparisonModal;
