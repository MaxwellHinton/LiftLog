import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { UserService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { RegisterUserDto } from './register-user.dto';
import { Multer } from 'multer';
import { UpdateUserProfileDto } from './update-user.dto';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
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
    @Body() updateUserDto: UpdateUserProfileDto,
  ): Promise<User> {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Post(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.resolve(__dirname, '../uploads/profile-pictures');
          console.log('Upload path:', uploadPath);
          fs.mkdirSync(uploadPath, { recursive: true })
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, cb) => {
        if(!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  ) async uploadProfilePicture(
    @Param('id') userId: string,
    @UploadedFile() file: Multer.File,
    ) {
      console.log('uploadProfilePicture called');
      if (!file) {
        throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
      }

      console.log('Received file:', file);

      const profilePicturePath = path.join('uploads', 'profile-pictures', file.filename).replace(/\\/g, '/');

      try {
        const updatedUser = await this.userService.updateUserProfilePicture(
          userId,
          profilePicturePath,
        );

        return {
          message: 'Profile picture uploaded successfully',
          profilePicture: profilePicturePath,
          user: updatedUser,
        };
      } catch (error) {
        console.error('Error updating user profile picture:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
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

  // // Remove user from gym (sets current gym to nothing and removes from gym users array)
  // @Delete(':id/gym/:gymId')
  // async removeUserFromGym(
  //   @Param('id') userId: string,
  //   @Param('gymId') gymId: string,
  // ): Promise<void> {
  //   return await this.gymUserSerivce.removeUserFromGym(userId, gymId);
  // }
}
