import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RideService } from './ride.service';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RideGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private rideService: RideService,
    private redisService: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    // In production, verify JWT from handshake
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @MessageBody() data: { lat: number; lng: number; userId: string; rideId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    // 1M Scale: Save to Redis instead of PostgreSQL
    await this.redisService.updateLocation(data.userId, data.lat, data.lng);

    // If part of an active ride, broadcast only to that room
    if (data.rideId) {
      this.server.to(`ride_${data.rideId}`).emit('locationUpdated', data);
    } else {
      // Otherwise, only notify nearby users if needed (throttled)
      // For global scale, we'd use geo-spatial broadcasting
    }
  }

  @SubscribeMessage('joinRide')
  async handleJoinRide(
    @MessageBody() data: { rideId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`ride_${data.rideId}`);
  }

  @SubscribeMessage('requestRide')
  async handleRideRequest(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const ride = await this.rideService.createRide(data.riderId, data);
    // Notify all drivers (or segmented by region in production)
    this.server.emit('newRideAvailable', ride);
    return ride;
  }

  @SubscribeMessage('acceptRide')
  async handleAcceptRide(
    @MessageBody() data: { rideId: string; driverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const ride = await this.rideService.acceptRide(data.rideId, data.driverId);
    
    // Join both to the ride room for private updates
    client.join(`ride_${ride.id}`);
    
    // Notify rider specifically
    this.server.to(ride.riderId).emit('rideAccepted', ride);
    return ride;
  }
}

