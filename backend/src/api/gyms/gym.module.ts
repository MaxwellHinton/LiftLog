import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { Gym, GymSchema } from './gym.schema';
import { UserModule } from '../users/users.module';
import { GymUserService } from '../gym-user/gym-user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Gym.name, schema: GymSchema }]),
        forwardRef(() => UserModule),
    ],
    providers: [GymService, GymUserService],
    controllers: [GymController],
    exports: [GymService, GymUserService],
})
export class GymModule {}