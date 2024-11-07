import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RegisterUserDto } from "./register-user.dto";
import { UpdateUserProfileDto } from "./update-user.dto";
import { User, UserDocument } from "./users.schema";
import { GymService } from "../gyms/gym.service";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private gymService: GymService,
    ) {}

    // create new user
    async createUser(userDto: RegisterUserDto): Promise<User> {
        const newUser = new this.userModel(userDto);
        return newUser.save();
    }

    // update user
    async updateUser(userId: string, updateUserDto: UpdateUserProfileDto): Promise<User> {

        const user = await this.userModel.findById(userId).exec();

        if(!user){
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        // check if user has also updated their current gym
        if(updateUserDto.currentGym && updateUserDto.currentGym !== user.currentGym){
            console.log(`Users current gym is changing from ${user.currentGym} to ${updateUserDto.currentGym}`);
            
            if(user.currentGym){
                await this.gymService.removeUser(user.currentGym.toString(), userId);
            }

            await this.gymService.addUser(updateUserDto.currentGym, userId);
        }

        return this.userModel.findByIdAndUpdate(
            userId, 
            { $set: updateUserDto },
            { new: true}
        ).exec()
    }

    // add user to gym
    async addUserToGym(userId: string, gymId: string): Promise<User> {

        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $set: { currentGym: gymId } },
            { new: true}
        ).exec()

        // also add user to the gyms users array
        await this.gymService.addUser(gymId, userId);
        return user;
    }

    // find user by id
    async findUserById(userId: string): Promise<User> {
        return this.userModel.findById(userId).exec()
    }

    // find user by username
    async findUserByUsername(username: string): Promise<User> {
        return this.userModel.findOne({ username }).exec()
    }

    // delete user 
    async deleteUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec()

        if(user.currentGym){
            await this.gymService.removeUser(user.currentGym, userId);
        }

        return this.userModel.findByIdAndDelete(userId).exec();

    }

    // delete user from gym
    async removeUserFromGym(userId: string, gymId: string): Promise<User>{
        
        const user = await this.userModel.findById(userId).exec()

        if(!user){
            throw new NotFoundException(`User with ID ${userId} was not found.`);
        }

        if(!gymId){
            throw new NotFoundException(`Gym with ID ${gymId} was not found.`);
        }

        // First thing we do is update the users current gym to ""
        await this.userModel.findByIdAndUpdate(
            userId,
            { $unset: { currentGym: ""} },
            { new: true }
        ).exec()

        // Use the gymService function to remove them from the gym.
        await this.gymService.removeUser(gymId, userId);
        return user;
    }
}