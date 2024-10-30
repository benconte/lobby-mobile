// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors';
// import RoomSelection from './RoomSelection';
// import GuestForm from './GuestForm';
// import Preferences from './Preferences';
// import Payment from './Payment';
// import ReviewBooking from './ReviewBooking';

// export interface BookingDetails {
//   checkIn: Date;
//   checkOut: Date;
//   guests: {
//     adults: number;
//     children: number;
//   };
//   nights: number;
//   totalPrice: number;
// }

// interface CheckoutModalProps {
//   visible: boolean;
//   onClose: () => void;
//   hotelName: string;
//   bookingDetails: BookingDetails;
// }

// type CheckoutStep = 'rooms' | 'guest-info' | 'preferences' | 'payment' | 'review';

// const steps: { id: CheckoutStep; title: string }[] = [
//   { id: 'rooms', title: 'Select Room' },
//   { id: 'guest-info', title: 'Guest Details' },
//   { id: 'preferences', title: 'Preferences' },
//   { id: 'payment', title: 'Payment' },
//   { id: 'review', title: 'Review' },
// ];

// const CheckoutModal: React.FC<CheckoutModalProps> = ({
//   visible,
//   onClose,
//   hotelName,
//   bookingDetails,
// }) => {
//   const [currentStep, setCurrentStep] = useState<CheckoutStep>('rooms');
//   const [bookingData, setBookingData] = useState({
//     room: null,
//     guestInfo: null,
//     preferences: null,
//     paymentMethod: null,
//   });

//   const handleNext = (data: any) => {
//     const currentIndex = steps.findIndex(step => step.id === currentStep);
    
//     // Update booking data based on current step
//     setBookingData(prev => ({
//       ...prev,
//       [currentStep]: data,
//     }));

//     // Move to next step
//     if (currentIndex < steps.length - 1) {
//       setCurrentStep(steps[currentIndex + 1].id);
//     }
//   };

//   const handleBack = () => {
//     const currentIndex = steps.findIndex(step => step.id === currentStep);
//     if (currentIndex > 0) {
//       setCurrentStep(steps[currentIndex - 1].id);
//     } else {
//       onClose();
//     }
//   };

//   const renderStepIndicator = () => (
//     <View style={styles.stepIndicator}>
//       {steps.map((step, index) => (
//         <React.Fragment key={step.id}>
//           <View style={[
//             styles.stepDot,
//             currentStep === step.id && styles.stepDotActive,
//             steps.findIndex(s => s.id === currentStep) > index && styles.stepDotCompleted,
//           ]} />
//           {index < steps.length - 1 && (
//             <View style={[
//               styles.stepLine,
//               steps.findIndex(s => s.id === currentStep) > index && styles.stepLineCompleted,
//             ]} />
//           )}
//         </React.Fragment>
//       ))}
//     </View>
//   );

//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 'rooms':
//         return (
//           <RoomSelection
//             bookingDetails={bookingDetails}
//             onNext={handleNext}
//           />
//         );
//       case 'guest-info':
//         return (
//           <GuestForm
//             bookingDetails={bookingDetails}
//             onNext={handleNext}
//           />
//         );
//       case 'preferences':
//         return (
//           <Preferences
//             onNext={handleNext}
//           />
//         );
//       case 'payment':
//         return (
//           <Payment
//             bookingDetails={bookingDetails}
//             onNext={handleNext}
//           />
//         );
//       case 'review':
//         return (
//           <ReviewBooking
//             bookingDetails={bookingDetails}
//             bookingData={bookingData}
//             onConfirm={handleNext}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       presentationStyle="pageSheet"
//     >
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//             <Ionicons name="chevron-back" size={24} color="black" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>
//             {steps.find(step => step.id === currentStep)?.title}
//           </Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Ionicons name="close" size={24} color="black" />
//           </TouchableOpacity>
//         </View>

//         {renderStepIndicator()}

//         <ScrollView style={styles.content}>
//           <Text style={styles.hotelName}>{hotelName}</Text>
//           <View style={styles.bookingInfo}>
//             <Text style={styles.bookingDates}>
//               {bookingDetails.checkIn.toLocaleDateString()} - {bookingDetails.checkOut.toLocaleDateString()}
//             </Text>
//             <Text style={styles.bookingGuests}>
//               {bookingDetails.guests.adults} Adults, {bookingDetails.guests.children} Children
//             </Text>
//           </View>

//           {renderCurrentStep()}
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   backButton: {
//     padding: 5,
//   },
//   closeButton: {
//     padding: 5,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   stepIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     justifyContent: 'center',
//   },
//   stepDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#ddd',
//   },
//   stepDotActive: {
//     backgroundColor: Colors.light.primary,
//     transform: [{ scale: 1.2 }],
//   },
//   stepDotCompleted: {
//     backgroundColor: Colors.light.primary,
//   },
//   stepLine: {
//     width: 30,
//     height: 2,
//     backgroundColor: '#ddd',
//     marginHorizontal: 5,
//   },
//   stepLineCompleted: {
//     backgroundColor: Colors.light.primary,
//   },
//   content: {
//     flex: 1,
//   },
//   hotelName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     padding: 20,
//   },
//   bookingInfo: {
//     padding: 20,
//     backgroundColor: Colors.light.background,
//     marginHorizontal: 20,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   bookingDates: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 5,
//   },
//   bookingGuests: {
//     color: '#666',
//   },
// });

// export default CheckoutModal;