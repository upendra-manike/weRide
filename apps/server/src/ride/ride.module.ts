import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RideService } from './ride.service';
import { RideGateway } from './ride.gateway';
import { RideProcessor } from './ride.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'ride_bookings',
    }),
  ],
  providers: [RideService, RideGateway, RideProcessor],
  exports: [RideService],
})
export class RideModule {}


