import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Theme } from '../theme/Theme';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const DriverDashboardScreen = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const [availableRides, setAvailableRides] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!socket || !isOnline) return;

        socket.on('newRideAvailable', (ride) => {
            setAvailableRides(prev => [...prev, ride]);
        });

        return () => {
            socket.off('newRideAvailable');
        };
    }, [socket, isOnline]);

    const handleAcceptRide = (rideId: string) => {
        socket?.emit('acceptRide', { rideId, driverId: user.id || 'driver-1' }, (ride: any) => {
            Alert.alert('Success', 'Ride accepted. Start navigation?');
            setAvailableRides([]); // Clear others for now
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Driver Center</Text>
                <TouchableOpacity 
                    style={[styles.toggleBtn, isOnline ? styles.online : styles.offline]}
                    onPress={() => setIsOnline(!isOnline)}
                >
                    <Text style={styles.toggleText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
                </TouchableOpacity>
            </View>

            {isOnline ? (
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Available Requests</Text>
                    {availableRides.length === 0 ? (
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>Waiting for nearby riders...</Text>
                        </View>
                    ) : (
                        <FlatList 
                            data={availableRides}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.rideCard}>
                                    <View>
                                        <Text style={styles.rideText}>From: {item.pickupAddress}</Text>
                                        <Text style={styles.rideText}>To: {item.dropoffAddress}</Text>
                                        <Text style={styles.priceText}>Fare: ${item.fare}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.acceptBtn}
                                        onPress={() => handleAcceptRide(item.id)}
                                    >
                                        <Text style={styles.acceptBtnText}>Accept</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}
                </View>
            ) : (
                <View style={styles.offlineView}>
                    <Text style={styles.offlineText}>You are currently offline.</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background, padding: 20, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    toggleBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
    online: { backgroundColor: Theme.colors.accent },
    offline: { backgroundColor: '#333' },
    toggleText: { color: 'white', fontWeight: 'bold' },
    content: { flex: 1 },
    sectionTitle: { color: Theme.colors.textMuted, fontSize: 14, marginBottom: 15 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: Theme.colors.textDim },
    rideCard: { backgroundColor: Theme.colors.card, padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: Theme.colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rideText: { color: 'white', fontSize: 14, marginBottom: 4 },
    priceText: { color: Theme.colors.primary, fontWeight: 'bold', marginTop: 5 },
    acceptBtn: { backgroundColor: Theme.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
    acceptBtnText: { color: 'white', fontWeight: 'bold' },
    offlineView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    offlineText: { color: Theme.colors.textDim, fontSize: 18 }
});

export default DriverDashboardScreen;
