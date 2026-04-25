import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RideStatus } from '@prisma/client';

@Injectable()
export class RideService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @InjectQueue('ride_bookings') private rideQueue: Queue,
  ) {}

  async createRide(riderId: string, data: any) {
    // 1. Persist the request initial state
    const ride = await this.prisma.ride.create({
      data: {
        riderId,
        pickupLat: data.pickupLat,
        pickupLong: data.pickupLong,
        pickupAddress: data.pickupAddress,
        dropoffLat: data.dropoffLat,
        dropoffLong: data.dropoffLong,
        dropoffAddress: data.dropoffAddress,
        fare: data.fare,
        status: RideStatus.REQUESTED,
      },
    });

    // 2. 1M Scale: Offload processing to BullMQ
    // This returns immediately to the user while workers find the driver
    await this.rideQueue.add('process-booking', {
      rideId: ride.id,
      pickupLat: data.pickupLat,
      pickupLong: data.pickupLong,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
    });

    return ride;
  }

  async findAvailableDrivers(lat: number, lng: number) {
    // 1M Scale: Using Redis Geo-spatial search for O(log(N)) performance
    const driverIds = await this.redis.findNearbyDrivers(lat, lng, 5); // 5km radius

    if (driverIds.length === 0) return [];

    return this.prisma.user.findMany({
      where: {
        id: { in: driverIds },
        role: 'DRIVER',
        isActive: true,
      },
      take: 10,
    });
  }

  async acceptRide(rideId: string, driverId: string) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== RideStatus.REQUESTED) throw new Error('Ride already accepted');

    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId,
        status: RideStatus.ACCEPTED,
      },
      include: {
        rider: true,
        driver: true,
      },
    });
  }

  async updateRideStatus(rideId: string, status: RideStatus) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: { status },
    });
  }
}


