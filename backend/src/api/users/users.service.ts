import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterUserDto } from './register-user.dto';
import { UpdateUserProfileDto } from './update-user.dto';
import { User, UserDocument } from './users.schema';
import { GymService } from '../gyms/gym.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => GymService)) private readonly gymService: GymService,
  ) {}

  // create new user
  async createUser(userDto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: userDto.email }).exec();
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);
  
    const newUser = new this.userModel({
      _id: new Types.ObjectId(),
      ...userDto,
      password: hashedPassword,
    });
  
    return newUser.save();
  }
  

  // validate user for login

  async validateUser(email: string, password: string): Promise<User | null> {

    console.log(`starting user validation for email ${email}`);
    const user = await this.userModel.findOne({ email }).exec();

    if(!user){
      console.log(`No user found with email: ${email}`)
      return null;
    }
    console.log(`User found with email: ${email}, proceeding to password validation`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      console.log(`Password validation failed for email: ${email}`);
      return null; // password mismatch
    }

    console.log(`Password validation successful for email: ${email}`);

    // Step 3: Return the user if validation is successful
    console.log(`User validation successful for email: ${email}`);

    return user;
  }

  // update user
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserProfileDto,
  ): Promise<User> {

    console.log(`Searching for user with id: ${userId}`);
    const user = await this.findUserById(userId);

    if (!user) {
      console.log('User not found:', userId);
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
    console.log("Searching for user with id: ", userId);

    const isValidObjectId = Types.ObjectId.isValid(userId);

    if(!isValidObjectId){
      console.error('Invalid ObjectId:', userId);
      return null;
    }

    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
    if(!user) {
      console.log('User not found brev: ', userId);
    } else {
      console.log('User found brev: ', user);
    }

    return user;
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

    console.log('looking for user in profilepicture upload: ', userId);

    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();

    if(!user){
      throw new NotFoundException('User not found');
    }

    user.profilePicture = profilePicturePath;
    await user.save();
    return user;
  }
}
