import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchAccommodations, YelpBusiness } from "@/functions/yelpapi";
import { useRouter } from "expo-router";

// Default placeholder image URL
const DEFAULT_IMAGE =
  "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media4.fl.yelpcdn.com%2Fbphoto%2FkeUNZcCYz5t2awLnYmRqdg%2Fo.jpg&w=384&q=75";

interface RecommendedListProps {
  location: string;
}

const RecommendedList: React.FC<RecommendedListProps> = ({ location }) => {
  const [recommendations, setRecommendations] = useState<YelpBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await searchAccommodations(location, 15, 0);
        // Filter out items without valid image URLs
        const validData = data.filter(
          (item) => item.image_url && item.image_url.trim() !== ""
        );
        setRecommendations(validData);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [location]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const getValidImageUrl = (url?: string) => {
    if (!url || url.trim() === "") {
      return DEFAULT_IMAGE;
    }
    return url;
  };

  const formatPrice = (price?: string) => {
    if (!price) return 15;
    return price.length * 25;
  };

  const handleNavigate = (id: string) => {
    router.push({
      pathname: `/hotel-details/[id]`,
      params: { id, event: "" },
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: YelpBusiness;
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.card,
        index === recommendations.length - 1 ? styles.lastCard : null,
      ]}
      onPress={() => handleNavigate(item.id)}
      activeOpacity={0.7}

    >
      <Image
        source={{ uri: getValidImageUrl(item.image_url) }}
        style={styles.image}
        defaultSource={require("@/assets/images/placeholder.png")} 
      />
      <TouchableOpacity style={styles.bookmark}>
        <Ionicons name="bookmark-outline" size={24} color="red" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {`${item.location.city}, ${item.location.state}`}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${formatPrice(item.price)}</Text>
          <Text style={styles.night}>/ night</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="orange" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.review_count} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <FlatList
          data={recommendations}
          renderItem={renderItem}
          keyExtractor={(item, index) => `recommended-${item.id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          //   initialNumToRender={3}
          maxToRenderPerBatch={15}
          windowSize={3}
          removeClippedSubviews={true}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  seeAll: {
    color: "orange",
    fontSize: 16,
  },
  loaderContainer: {
    padding: 20,
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  card: {
    width: 260,
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 20,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  lastCard: {
    marginRight: 0,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  bookmark: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    color: "#666",
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
  },
  night: {
    color: "#666",
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  rating: {
    marginLeft: 5,
    fontWeight: "500",
  },
  reviews: {
    color: "#666",
    marginLeft: 5,
    fontSize: 12,
  },
});

export default RecommendedList;
