import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const categories = ['All', 'Guest House', 'B&B', 'Hotel', 'Motel'];

const CategoryList = () => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((category, index) => (
        <View 
          key={index} 
          style={[
            styles.categoryItem,
            index === 0 && styles.activeCategory,
          ]}
        >
          <Text 
            style={[
              styles.categoryText,
              index === 0 && styles.activeCategoryText,
            ]}
          >
            {category}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingRight: 30
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategory: {
    backgroundColor: 'red',
  },
  categoryText: {
    color: '#666',
    fontSize: 16,
  },
  activeCategoryText: {
    color: 'white',
  },
});