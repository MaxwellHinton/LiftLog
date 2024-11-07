import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { RegisterUserDto } from './register-user.dto';
import { UpdateUserProfileDto } from './update-user.dto';
import { User } from './users.schema';
import { GymUserService } from '../gym-user/gym-user.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UserService,
        private readonly gymUserSerivce: GymUserService
    ) {}

    // /users with POST creates a user using only RegisterDto
    @Post()
    async createUser(@Body() userDto: RegisterUserDto): Promise<User> {
        return await this.userService.createUser(userDto);
    }

    // /users/:id updates user information.
    @Put(':id')
    async updateUser(
        @Param('id') userId: string,
        @Body() updateUserDto: UpdateUserProfileDto
    ): Promise<User> {
        return await this.userService.updateUser(userId, updateUserDto);
    }

    // add user to gym, specific update to ensure the gyms users array is updated as well as the users current gym.
    @Put(':id/add-to-gym/:gymId')
    async addToGym(
        @Param('id') userId: string,
        @Param('gymId') gymId: string,
    ){
        return this.gymUserSerivce.addUserToGym(userId, gymId);
    }

    @Get(':id')
    async findUserById(@Param('id') userId: string): Promise<User> {
        return await this.userService.findUserById(userId);
    }

    @Get('username/:username')
    async findUserByUsername(@Param('username') username: string): Promise<User> {
        return await this.userService.findUserByUsername(username);
    }

    // deletes the users profile removing them from the users database
    @Delete(':id')
    async deleteUser(@Param('id') userId: string): Promise<User> {
        return await this.userService.deleteUser(userId);
    }

    // Remove user from gym (sets current gym to nothing and removes from gym users array)
    @Delete(':id/gym/:gymId')
    async removeUserFromGym(
        @Param('id') userId: string,
        @Param('gymId') gymId: string
    ): Promise<void> {
        return await this.gymUserSerivce.removeUserFromGym(userId, gymId);
    }
}