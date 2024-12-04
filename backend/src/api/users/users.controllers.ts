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
  HttpStatus,
  UseGuards,
  Request
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // /users with POST creates a user using only RegisterDto
  @Post()
  async createUser(@Body() userDto: RegisterUserDto): Promise<{access_token: string, user: Partial<User> }> {
    console.log(`Hitting createUser route for userId`);
    const user = await this.userService.createUser(userDto);

    const payload = { email: user.email, sub: user._id.toString() };
    const access_token = this.jwtService.sign(payload);

    return { access_token,
      user: {
        _id: user._id,
        yourName: user.yourName,
        email: user.email,
      }
    }
  }


  // /users/:id updates user information.
  @UseGuards(JwtAuthGuard)  
  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserProfileDto,
    @Request() req
  ): Promise<User> {
    console.log(`Hitting updateUser route for userId: ${userId}`);
    console.log('Information sent to update: ', updateUserDto);
    console.log("User access_token", req.access_token);
    console.log("Req.user id: ", req.user._id);

    if(req.user._id.toString() !== userId){
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    console.log('Update request received for userId:', userId);
    console.log('Update data received:', updateUserDto);
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard) 
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

  @UseGuards(JwtAuthGuard)  
  @Get(':id')
  async findUserById(@Param('id') userId: string, @Request() req): Promise<User> {

    console.log('Attempting to get user with userId: ', userId);
    console.log('req.user = ', req.user);
    console.log(`req.user.userId = ${req.user._id}`);
    console.log(`req.user.userId as a string = ${req.user._id.toString()}`);

    if(req.user._id.toString() !== userId){
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    
    return await this.userService.findUserById(userId);
  }

  // deletes the users profile removing them from the users database
  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  async deleteUser(@Param('id') userId: string, @Request() req): Promise<User> {

    if(req.user.userId !== userId){
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this.userService.deleteUser(userId);
  }
}
