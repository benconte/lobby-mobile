import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchAccommodations, YelpBusiness } from "@/functions/yelpapi";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/themeContext";
import { getTheme } from "@/constants/Colors";

const DEFAULT_IMAGE =
  "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media4.fl.yelpcdn.com%2Fbphoto%2FkeUNZcCYz5t2awLnYmRqdg%2Fo.jpg&w=384&q=75";

interface RecommendedListProps {
  location: string;
}

const RecommendedList: React.FC<RecommendedListProps> = ({ location }) => {
  const [recommendations, setRecommendations] = useState<YelpBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await searchAccommodations(location, 15, 0);
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

  const getThemedStyles = () => {
    return {
      container: {
        ...styles.container,
        backgroundColor: activeTheme.background,
      } as ViewStyle,
      card: {
        ...styles.card,
        // backgroundColor: activeTheme.card,
        shadowColor: activeTheme.primary,
      } as ViewStyle,
      bookmark: {
        ...styles.bookmark,
        backgroundColor: activeTheme.background,
      } as ViewStyle,
      title: {
        ...styles.title,
        color: activeTheme.text,
      } as TextStyle,
      location: {
        ...styles.location,
        color: activeTheme.secondary,
      } as TextStyle,
      price: {
        ...styles.price,
        color: activeTheme.primary,
      } as TextStyle,
      night: {
        ...styles.night,
        color: activeTheme.secondary,
      } as TextStyle,
      rating: {
        ...styles.rating,
        color: activeTheme.text,
      } as TextStyle,
      reviews: {
        ...styles.reviews,
        color: activeTheme.secondary,
      } as TextStyle,
    };
  };

  const themedStyles = getThemedStyles();

  const getValidImageUrl = (url?: string) => {
    return url?.trim() || DEFAULT_IMAGE;
  };

  const formatPrice = (price?: string) => {
    return price ? price.length * 25 : 15;
  };

  const handleNavigate = (id: string) => {
    router.push({
      pathname: `/hotel-details/[id]`,
      params: { id, event: "" },
    });
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: activeTheme.background }]}>
        <ActivityIndicator size="large" color={activeTheme.primary} />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: YelpBusiness; index: number }) => (
    <TouchableOpacity
      style={[
        themedStyles.card,
        index === recommendations.length - 1 && styles.lastCard,
      ]}
      onPress={() => handleNavigate(item.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: getValidImageUrl(item.image_url) }}
        style={styles.image}
        defaultSource={require("@/assets/images/placeholder.png")}
      />
      <TouchableOpacity style={themedStyles.bookmark}>
        <Ionicons 
          name="bookmark-outline" 
          size={24} 
          color={activeTheme.primary} 
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={themedStyles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={themedStyles.location} numberOfLines={1}>
          {`${item.location.city}, ${item.location.state}`}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={themedStyles.price}>${formatPrice(item.price)}</Text>
          <Text style={themedStyles.night}>/ night</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons 
            name="star" 
            size={16} 
            color={activeTheme.primary}
          />
          <Text style={themedStyles.rating}>{item.rating}</Text>
          <Text style={themedStyles.reviews}>({item.review_count} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={themedStyles.container}>
      <FlatList
        data={recommendations}
        renderItem={renderItem}
        keyExtractor={(item, index) => `recommended-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    borderRadius: 20,
    marginRight: 20,
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
  },
  night: {
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
    marginLeft: 5,
    fontSize: 12,
  },
});

export default RecommendedList;
