const YELP_API_KEY = process.env.EXPO_PUBLIC_YELP_API_KEY;

export interface YelpBusiness {
  id: string;
  name: string;
  image_url: string;
  location: {
    address1: string;
    city: string;
    state: string;
  };
  price?: string;
  rating: number;
  review_count: number;
  categories: Array<{ title: string }>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const searchAccommodations = async (
  location: string,
  limit: number = 10,
  offset: number = 0
): Promise<YelpBusiness[]> => {
  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=hotels&location=${location}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    return data.businesses || [];
  } catch (error) {
    console.error('Error fetching from Yelp:', error);
    return [];
  }
};