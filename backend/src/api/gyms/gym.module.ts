import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { Gym, GymSchema } from './gym.schema';
import { UserModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gym.name, schema: GymSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [GymService],
  controllers: [GymController],
  exports: [GymService],
})
export class GymModule {}
