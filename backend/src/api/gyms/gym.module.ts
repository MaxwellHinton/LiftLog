import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { Gym, GymSchema } from './gym.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Gym.name, schema: GymSchema }]),
    ],
    providers: [GymService],
    controllers: [GymController],
    exports: [GymService],
})
export class GymModule {}