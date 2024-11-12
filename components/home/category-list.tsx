import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/context/themeContext';
import { getTheme } from '@/constants/Colors';

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'guesthouse', name: 'Guest House' },
  { id: 'bnb', name: 'B&B' },
  { id: 'hotel', name: 'Hotel' },
  { id: 'motel', name: 'Motel' },
];

interface CategoryListProps {
  onCategorySelect?: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const { isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

  const handleCategoryPress = (category: Category) => {
    setActiveCategory(category.id);
    onCategorySelect?.(category);
  };

  const getThemedStyles = () => {
    return {
      container: {
        ...styles.container,
        backgroundColor: activeTheme.background,
      } as ViewStyle,
      categoryItem: {
        ...styles.categoryItem,
        // backgroundColor: activeTheme.card,
      } as ViewStyle,
      activeCategory: {
        backgroundColor: activeTheme.primary,
      } as ViewStyle,
      categoryText: {
        ...styles.categoryText,
        color: activeTheme.secondary,
      } as TextStyle,
      activeCategoryText: {
        color: '#FFFFFF',
      } as TextStyle,
    };
  };

  const themedStyles = getThemedStyles();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={themedStyles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity 
          key={category.id}
          activeOpacity={0.7}
          onPress={() => handleCategoryPress(category)}
        >
          <View 
            style={[
              themedStyles.categoryItem,
              activeCategory === category.id && themedStyles.activeCategory,
              styles.categoryItemContainer,
            ]}
          >
            <Text 
              style={[
                themedStyles.categoryText,
                activeCategory === category.id && themedStyles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingRight: 10,
  },
  categoryItemContainer: {
    marginRight: 10,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CategoryList;