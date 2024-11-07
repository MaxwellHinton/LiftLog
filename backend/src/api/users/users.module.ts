import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./users.service";
import { UsersController } from "./users.controllers";
import { User, UserSchema } from "./users.schema";
import { GymModule } from "../gyms/gym.module";

@Module({
    imports: [
        MongooseModule.forFeature([ { name: User.name, schema: UserSchema}]),
        GymModule,
    ],
    providers: [UserService],
    controllers: [UsersController],
})
export class UserModule {}