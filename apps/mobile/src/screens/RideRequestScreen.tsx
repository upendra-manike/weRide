import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Theme } from '../theme/Theme';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const vehicles = [
  { id: '1', name: 'Economy', price: '$15.20', time: '4 min', type: 'ECONOMY' },
  { id: '2', name: 'Standard', price: '$22.50', time: '2 min', type: 'STANDARD' },
  { id: '3', name: 'Premium', price: '$35.00', time: '5 min', type: 'PREMIUM' },
];

const RideRequestScreen = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const [requesting, setRequesting] = useState(false);

  const handleRequestRide = () => {
    if (!socket) return;
    setRequesting(true);
    
    socket.emit('requestRide', {
      riderId: user.id || 'guest-123',
      pickupLat: 34.0522,
      pickupLong: -118.2437,
      pickupAddress: 'Downtown LA',
      dropoffLat: 34.2001,
      dropoffLong: -118.4001,
      dropoffAddress: 'Van Nuys',
      fare: 22.50,
    });

    socket.on('rideAccepted', (ride) => {
      setRequesting(false);
      Alert.alert('Ride Accepted!', `Driver ${ride.driver.name} is on the way.`);
    });
  };
  return (
    <View style={styles.container}>
      {/* Fake Map Background */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.header}>
            <View style={styles.searchBar}>
                <Text style={styles.searchText}>Where to?</Text>
            </View>
        </View>
        <View style={styles.routeContainer}>
           <View style={styles.dot} />
           <View style={styles.line} />
           <View style={[styles.dot, { backgroundColor: Theme.colors.secondary }]} />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        
        <Text style={styles.title}>Recommended Rides</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleList}>
          {vehicles.map((v) => (
            <TouchableOpacity key={v.id} style={styles.vehicleCard}>
              <View style={styles.vehicleIconPlaceholder} />
              <Text style={styles.vehicleName}>{v.name}</Text>
              <Text style={styles.vehicleTime}>{v.time} away</Text>
              <Text style={styles.vehiclePrice}>{v.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.fareContainer}>
            <View>
                <Text style={styles.fareLabel}>Estimated Fare</Text>
                <Text style={styles.fareValue}>$22.50 • Apple Pay</Text>
            </View>
            <TouchableOpacity 
                style={[styles.requestButton, requesting && { opacity: 0.7 }]} 
                onPress={handleRequestRide}
                disabled={requesting}
            >
                <Text style={styles.requestButtonText}>
                    {requesting ? 'Searching...' : 'Request Ride'}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    width: '90%',
  },
  searchBar: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  searchText: {
    color: Theme.colors.textMuted,
    fontSize: 16,
  },
  routeContainer: {
      alignItems: 'center',
  },
  dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Theme.colors.primary,
  },
  line: {
      width: 2,
      height: 80,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginVertical: 4,
  },
  bottomSheet: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 20,
  },
  vehicleList: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  vehicleCard: {
    width: 130,
    padding: 15,
    backgroundColor: Theme.colors.glass,
    borderRadius: Theme.radius.md,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
  },
  vehicleIconPlaceholder: {
      width: 60,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      marginBottom: 10,
  },
  vehicleName: {
    color: Theme.colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  vehicleTime: {
    color: Theme.colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  vehiclePrice: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 16,
  },
  fareContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: Theme.colors.border,
      paddingTop: 20,
  },
  fareLabel: {
      color: Theme.colors.textDim,
      fontSize: 12,
  },
  fareValue: {
      color: Theme.colors.text,
      fontSize: 14,
      fontWeight: '600',
      marginTop: 2,
  },
  requestButton: {
      backgroundColor: Theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: Theme.radius.full,
  },
  requestButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  }
});

export default RideRequestScreen;
