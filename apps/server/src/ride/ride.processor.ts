import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RideService } from './ride.service';
import { RideGateway } from './ride.gateway';

@Processor('ride_bookings')
export class RideProcessor extends WorkerHost {
  constructor(
    private readonly rideService: RideService,
    private readonly rideGateway: RideGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { rideId, pickupLat, pickupLong } = job.data;

    console.log(`Processing ride booking: ${rideId}`);

    // 1. Find nearby drivers using the optimized Redis GeoSearch
    const drivers = await this.rideService.findAvailableDrivers(pickupLat, pickupLong);

    if (drivers.length === 0) {
      console.log(`No drivers found for ride ${rideId}`);
      // In a real app, you might re-queue this job with a delay or notify the rider
      return;
    }

    // 2. Notify ONLY the relevant drivers via Socket.io
    // Instead of broadcasting to 1M users, we target the specific nearby IDs
    drivers.forEach(driver => {
      this.rideGateway.server.to(driver.id).emit('newRideAvailable', {
        rideId,
        pickupLat,
        pickupLong,
      });
    });

    return { notifiedCount: drivers.length };
  }
}
