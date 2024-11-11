import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './users.service';
import { UsersController } from './users.controllers';
import { User, UserSchema } from './users.schema';
import { GymModule } from '../gyms/gym.module';
import { GymUserService } from '../gym-user/gym-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => GymModule),
  ],
  providers: [UserService, GymUserService],
  controllers: [UsersController],
  exports: [UserService, GymUserService],
})
export class UserModule {}
