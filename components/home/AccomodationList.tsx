import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text } from 'react-native';
import AccommodationCard from './AccommodationCard';
import { searchAccommodations, YelpBusiness } from '@/functions/yelpapi';

interface AccommodationListProps {
  location: string;
}

const AccommodationList: React.FC<AccommodationListProps> = ({ location }) => {
  const [accommodations, setAccommodations] = useState<YelpBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add refs to track loading state and prevent duplicate requests
  const isLoadingMore = useRef(false);
  const flatListRef = useRef<FlatList>(null);

  const fetchAccommodations = async (resetList: boolean = false) => {
    if ((!hasMore && !resetList) || isLoadingMore.current) return;

    try {
      setLoading(true);
      isLoadingMore.current = true;
      setError(null);
      
      const newOffset = resetList ? 0 : offset;
      const yelpData = await searchAccommodations(location, 10, newOffset);
      
      if (resetList) {
        setAccommodations(yelpData || []);
        setOffset(10);
        setHasMore(yelpData?.length === 10);
      } else {
        const existingIds = new Set(accommodations.map(acc => acc.id));
        const uniqueNewData = yelpData.filter(item => !existingIds.has(item.id));
        
        if (uniqueNewData.length === 0) {
          setHasMore(false);
          return;
        }
        setAccommodations(prev => [...prev, ...uniqueNewData]);
        setOffset(prev => prev + uniqueNewData.length);
        setHasMore(uniqueNewData.length === 10);
      }
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      setError('Failed to load accommodations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      isLoadingMore.current = false;
    }
  };

  useEffect(() => {
    setHasMore(true);
    setOffset(0);
    isLoadingMore.current = false;
    fetchAccommodations(true);

    // Cleanup function
    return () => {
      isLoadingMore.current = false;
    };
  }, [location]);

  const onRefresh = useCallback(() => {
    if (isLoadingMore.current) return;
    setRefreshing(true);
    setHasMore(true);
    fetchAccommodations(true);
  }, []);

  const renderItem = useCallback(({ item }: { item: YelpBusiness }) => (
    <AccommodationCard
      title={item.name}
      location={`${item.location.address1}, ${item.location.city}`}
      description={item.categories.map(cat => cat.title).join(', ')}
      price={item.price ? item.price.length * 25 : 15}
      rating={item.rating}
      image={item.image_url}
      hotelId={item.id}
    />
  ), []);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !isLoadingMore.current) {
      fetchAccommodations(false);
    }
  }, [loading, hasMore]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (loading && accommodations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={accommodations}
        keyExtractor={(item, index) => `acc-${item.id}-${index}`}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && accommodations.length > 0 ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No accommodations found</Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          accommodations.length === 0 && styles.emptyListContent
        ]}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        onMomentumScrollBegin={() => {
          isLoadingMore.current = false;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  loader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AccommodationList;