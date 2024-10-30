import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Default placeholder image URL
const DEFAULT_IMAGE =
  "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media4.fl.yelpcdn.com%2Fbphoto%2FkeUNZcCYz5t2awLnYmRqdg%2Fo.jpg&w=384&q=75";
interface AccommodationCardProps {
  title: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  hotelId: string;
}

const AccommodationCard = ({
  title,
  location,
  description,
  price,
  rating,
  image,
  hotelId,
}: AccommodationCardProps) => {
  const router = useRouter();
  const getValidImageUrl = (url?: string) => {
    if (!url || url.trim() === "") {
      return DEFAULT_IMAGE;
    }
    return url;
  };

  const handleNavigate = () => {
    router.push({
      pathname: `/hotel-details/[id]`,
      params: { id: hotelId, event: "" },
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleNavigate}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: getValidImageUrl(image) }}
        style={styles.image}
        defaultSource={require("@/assets/images/placeholder.png")} // Add a local placeholder
        // Add error handling for failed image loads
        onError={(error) => console.log("Image loading error:", error)}
      />
      <TouchableOpacity style={styles.bookmark}>
        <Ionicons name="bookmark-outline" size={24} color="red" />
      </TouchableOpacity>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Motel</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.price}>
            <Text style={styles.amount}>${price}</Text>
            <Text style={styles.period}>/ Night</Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{rating}</Text>
            <Ionicons name="star" size={16} color="orange" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#f0f0f0", // Add background color for image placeholder
  },
  bookmark: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    left: 15,
    top: 15,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  badgeText: {
    color: "#666",
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  location: {
    color: "#666",
    marginTop: 5,
  },
  description: {
    marginTop: 10,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  price: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
  },
  period: {
    color: "#666",
    marginLeft: 5,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginRight: 5,
    fontWeight: "500",
  },
});

export default AccommodationCard;
