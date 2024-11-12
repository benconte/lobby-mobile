import { useState, useCallback } from 'react';

export interface Category {
  id: string;
  name: string;
}

export const useCategories = () => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [categories] = useState<Category[]>([
    { id: 'all', name: 'All' },
    { id: 'guesthouse', name: 'Guest House' },
    { id: 'bnb', name: 'B&B' },
    { id: 'hotel', name: 'Hotel' },
    { id: 'motel', name: 'Motel' },
  ]);

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  return {
    categories,
    activeCategory,
    handleCategoryChange,
  };
};