import ws from 'k6/ws';
import { check, sleep } from 'k6';

/**
 * weRide Driver Simulator (k6)
 * 
 * This script simulates virtual drivers who:
 * 1. Connect via WebSockets.
 * 2. Send continuous location pings to Redis.
 * 3. Listen for new ride requests in their area.
 * 4. Automatically "accept" rides to complete the cycle.
 */

export const options = {
    vus: 50, // Simulate 50 active drivers
    duration: '2m',
};

const BASE_URL = __ENV.API_URL || 'ws://localhost:3000';

export default function () {
    const url = `${BASE_URL}/socket.io/?EIO=4&transport=websocket`;
    const driverId = `driver-${__VU}-${Math.floor(Math.random() * 1000)}`;

    const response = ws.connect(url, null, function (socket) {
        socket.on('open', function () {
            // Socket.io Handshake
            socket.send('40');

            // 1. Simulate constant movement (Location Updates)
            // This tests the Redis Geo-Spatial update throughput
            socket.setInterval(function () {
                const lat = 40.7128 + (Math.random() - 0.5) * 0.05;
                const lng = -74.0060 + (Math.random() - 0.5) * 0.05;

                const payload = JSON.stringify([
                    'updateLocation',
                    {
                        userId: driverId,
                        lat: lat,
                        lng: lng
                    }
                ]);
                socket.send(`42${payload}`);
            }, 3000); // Pulse every 3 seconds
        });

        socket.on('message', function (message) {
            // 2. Listen for 'newRideAvailable' events from the BullMQ worker
            if (message.includes('newRideAvailable')) {
                const data = JSON.parse(message.substring(2)); // Strip Engine.io code
                const eventData = data[1];
                const rideId = eventData.rideId;

                console.log(`Driver ${driverId} received ride request: ${rideId}`);

                // 3. Simulate "Reaction Time" then accept the ride
                sleep(Math.random() * 2 + 1);

                const acceptPayload = JSON.stringify([
                    'acceptRide',
                    {
                        rideId: rideId,
                        driverId: driverId
                    }
                ]);
                socket.send(`42${acceptPayload}`);
            }
        });

        socket.on('error', (e) => console.log('Driver Socket Error: ', e.error()));

        // Stay online for the duration of the test
        sleep(110);
        socket.close();
    });

    check(response, { 'driver connected': (r) => r && r.status === 101 });
}
