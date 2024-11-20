import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './register-user.dto';
import { UpdateUserProfileDto } from './update-user.dto';
import { User, UserDocument } from './users.schema';
import { GymService } from '../gyms/gym.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => GymService)) private readonly gymService: GymService,
  ) {}

  // create new user
  async createUser(userDto: RegisterUserDto): Promise<User> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }

  // update user
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserProfileDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // check if user has also updated their current gym
    if (
      updateUserDto.currentGym &&
      updateUserDto.currentGym !== user.currentGym
    ) {
      console.log(
        `Users current gym is changing from ${user.currentGym} to ${updateUserDto.currentGym}`,
      );

      if (user.currentGym) {
        await this.gymService.removeUser(user.currentGym, userId);
      }

      console.log(`Adding user to new gym: ${updateUserDto.currentGym}`);
      const updatedGym = await this.gymService.addUser(updateUserDto.currentGym, userId);
      console.log(`Updated Gym:`, updatedGym);
      
      user.currentGym = updateUserDto.currentGym;
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateUserDto },
      { new: true },
    )
    .exec();

    console.log(`Updated User: `, updatedUser);
    return updatedUser;
  }

  // find user by id
  async findUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  // delete user
  async deleteUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    if(!user){
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.currentGym) {
      await this.gymService.removeUser(user.currentGym, userId);
    }

    return this.userModel.findByIdAndDelete(userId).exec();
  }

  async updateUserProfilePicture(userId: string, profilePicturePath: string): Promise<User> {
    const user = await this.userModel.findById(userId);

    if(!user){
      throw new NotFoundException('User not found');
    }

    user.profilePicture = profilePicturePath;
    await user.save();
    return user;
  }
}
