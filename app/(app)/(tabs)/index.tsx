import AccommodationList from "@/components/home/AccomodationList";
import CategoryList from "@/components/home/category-list";
import LocationSelector from "@/components/home/LocationSelector";
import RecommendedList from "@/components/home/RecommendedList";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/themeContext";
import { getTheme } from "@/constants/Colors";
import ThemedButton from "@/components/themed-button";

type Section = {
  type: string;
  id: string;
};

const HomeScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState("NYC");
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

  const sections: Section[] = [
    { type: 'header', id: 'header' },
    { type: 'location', id: 'location' },
    { type: 'categories', id: 'categories' },
    { type: 'recommended', id: 'recommended' },
    { type: 'recommendedHeader', id: 'recommendedHeader' },
    { type: 'accommodations', id: 'accommodations' }
  ];

  const renderItem = ({ item }: { item: Section }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={[
            styles.header, 
            { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }
          ]}>
            <Text style={[styles.title, { color: activeTheme.text }]}>
              Explore
            </Text>
            <ThemedButton
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              onPress={toggleTheme}
              variant="outlined"
              style={styles.themeButton}
            />
          </View>
        );
      
      case 'location':
        return (
          <LocationSelector
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        );
      
      case 'categories':
        return <CategoryList />;
      
      case 'recommended':
        return <RecommendedList location={"Brooklyn"} />;
      
      case 'recommendedHeader':
        return (
          <View style={styles.recommendedHeader}>
            <Text style={[
              styles.recommendedTitle,
              { color: activeTheme.text }
            ]}>
              Recommended
            </Text>
            <TouchableOpacity>
              <Text style={[
                styles.seeAll,
                { color: activeTheme.primary }
              ]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'accommodations':
        return <AccommodationList location={selectedLocation} />;
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: activeTheme.background }
    ]}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  recommendedTitle: {
    fontSize: 24,
    fontWeight: "500",
  },
  seeAll: {
    fontSize: 16,
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
