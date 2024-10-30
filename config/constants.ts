import { PreferenceOption, Room } from "@/types/booking";

export const roomTypes: Room[] = [
  {
    id: "standard",
    name: "Standard Room",
    description: "Comfortable room with essential amenities",
    price: 100,
    size: "28m²",
    maxOccupancy: 2,
    bedType: "1 Queen Bed",
    images: [
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media4.fl.yelpcdn.com%2Fbphoto%2FmlQBkVlzHnYEG0Ockbw6gA%2Fo.jpg&w=384&q=75",
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media1.fl.yelpcdn.com%2Fbphoto%2F_BPj03zxONFflKrkzgdx0Q%2Fo.jpg&w=384&q=75",
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media1.fl.yelpcdn.com%2Fbphoto%2FPOF0KxPmyNAMLE6zjfe7GA%2Fo.jpg&w=384&q=75",
    ],
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "tv", name: "Smart TV" },
      { icon: "thermometer", name: "AC" },
      { icon: "business", name: "Work Desk" },
    ],
    features: ["City View", "Daily Housekeeping", "Free Toiletries"],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "Spacious room with premium amenities and city view",
    price: 150,
    size: "35m²",
    maxOccupancy: 3,
    bedType: "1 King Bed",
    images: [
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media1.fl.yelpcdn.com%2Fbphoto%2F4cy6jOUCmm_5g-9WYk_HJg%2Fo.jpg&w=384&q=75",
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media2.fl.yelpcdn.com%2Fbphoto%2F2gxkuYgoXWPoCsD0sPXDXw%2Fo.jpg&w=384&q=75",
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media4.fl.yelpcdn.com%2Fbphoto%2Fx9Tg9HM2NjStQcY1Ehs_TA%2Fo.jpg&w=384&q=75",
    ],
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "tv", name: "Smart TV" },
      { icon: "thermometer", name: "AC" },
      { icon: "business", name: "Work Desk" },
      { icon: "cafe", name: "Coffee Maker" },
      { icon: "wine", name: "Mini Bar" },
    ],
    features: [
      "City View",
      "Daily Housekeeping",
      "Premium Toiletries",
      "Bathrobe & Slippers",
    ],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
  },
  {
    id: "suite",
    name: "Executive Suite",
    description: "Luxury suite with separate living area and premium services",
    price: 250,
    size: "48m²",
    maxOccupancy: 4,
    bedType: "1 King Bed + Sofa Bed",
    images: [
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media3.fl.yelpcdn.com%2Fbphoto%2FfIFd2Kf9RsW16m3MKQiNqw%2Fo.jpg&w=384&q=75",
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media2.fl.yelpcdn.com%2Fbphoto%2FxfFEmjstKCCGMEqeiMNo7A%2Fo.jpg&w=384&q=75",
      "https://lobby-benconte.vercel.app/_next/image?url=https%3A%2F%2Fs3-media1.fl.yelpcdn.com%2Fbphoto%2FH2_VhxBGyokMFhyYdn0MVg%2Fo.jpg&w=384&q=75",
    ],
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "tv", name: "Smart TV" },
      { icon: "thermometer", name: "AC" },
      { icon: "business", name: "Work Desk" },
      { icon: "cafe", name: "Coffee Maker" },
      { icon: "wine", name: "Mini Bar" },
      { icon: "restaurant", name: "Room Service" },
      { icon: "shirt", name: "Iron" },
    ],
    features: [
      "City View",
      "Daily Housekeeping",
      "Premium Toiletries",
      "Bathrobe & Slippers",
      "Separate Living Area",
      "Executive Lounge Access",
    ],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
  },
];


export const PREFERENCES: PreferenceOption[] = [
  {
    id: "early-checkin",
    icon: "time",
    title: "Early Check-in",
    description: "Subject to availability",
  },
  {
    id: "late-checkout",
    icon: "time-outline",
    title: "Late Check-out",
    description: "Subject to availability",
  },
  {
    id: "high-floor",
    icon: "business",
    title: "High Floor",
    description: "Room on higher floors",
  },
  {
    id: "quiet-room",
    icon: "moon",
    title: "Quiet Room",
    description: "Away from elevator and street noise",
  },
  {
    id: "airport-transfer",
    icon: "car",
    title: "Airport Transfer",
    description: "Additional charges apply",
  },
];