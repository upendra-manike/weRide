import ws from 'k6/ws';
import { check, sleep } from 'k6';

/**
 * weRide 1M Scale Load Test Script (k6)
 * 
 * This script simulates virtual users (riders) connecting via Socket.io 
 * and requesting rides to verify the backend's asynchronous processing performance.
 */

export const options = {
    stages: [
        { duration: '30s', target: 100 }, // Ramp-up to 100 concurrent users
        { duration: '1m', target: 100 },  // Stay at 100 users
        { duration: '30s', target: 0 },   // Ramp-down
    ],
    thresholds: {
        'ws_session_duration': ['avg<500'], // Avg session duration should be low
    },
};

const BASE_URL = __ENV.API_URL || 'ws://localhost:3000';

export default function () {
    const url = `${BASE_URL}/socket.io/?EIO=4&transport=websocket`;
    
    const params = { tags: { my_tag: 'rider' } };

    const response = ws.connect(url, params, function (socket) {
        socket.on('open', function () {
            // Socket.io Handshake
            socket.send('40'); // Message indicating a namespace connection

            // Request a ride every few seconds
            socket.setInterval(function () {
                const payload = JSON.stringify([
                    'requestRide',
                    {
                        riderId: `rider-${Math.floor(Math.random() * 10000)}`,
                        pickupLat: 40.7128 + (Math.random() - 0.5) * 0.1,
                        pickupLong: -74.0060 + (Math.random() - 0.5) * 0.1,
                        pickupAddress: '123 Test St',
                        dropoffLat: 40.7128 + (Math.random() - 0.5) * 0.1,
                        dropoffLong: -74.0060 + (Math.random() - 0.5) * 0.1,
                        dropoffAddress: '456 Market St',
                        fare: 25.50
                    }
                ]);

                socket.send(`42${payload}`); // 42 is the code for an ENGINE.IO message
            }, 5000); // Ride request every 5 seconds per VU
        });

        socket.on('message', function (message) {
            // Check for success responses or incoming driver matches
            if (message.includes('rideAccepted')) {
                check(message, { 'ride accepted': (m) => m.includes('rideAccepted') });
            }
        });

        socket.on('close', () => console.log('WebSocket connection closed'));
        socket.on('error', (e) => console.log('WebSocket error: ', e.error()));

        // Keep connection open for 20 seconds to simulate a user session
        sleep(20);
        socket.close();
    });

    check(response, { 'status is 101': (r) => r && r.status === 101 });
}
