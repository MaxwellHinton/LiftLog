import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './create-gym.dto';
import { Gym } from './gym.schema';
import { Machine } from './machine.schema';
import { Types } from 'mongoose';

@Controller('gyms')
export class GymController {
    constructor(private readonly gymService: GymService) {}

    /* -------------------- Gym functions --------------------*/ 

    @Post()
    async createGym(@Body() createGymDto: CreateGymDto): Promise<Gym> {
        return await this.gymService.createGym(createGymDto);
    }

    @Get(':id')
    async getGymById(@Param('id') id: string): Promise<Gym> {
        return this.gymService.getGymById(id);
    }

    @Get(':id/users')
    async getGymByIdWithUsers(@Param('id') id: string): Promise<Gym> {
        return this.gymService.getGymByIdWithUsers(id);
    }

    @Get()
    async getAllGyms(): Promise<Gym[]> {
        return this.gymService.getAllGyms();
    }

    @Get('with-users')
    async getAllGymsWithUsers(): Promise<Gym[]> {
        return this.gymService.getAllGymsWithUsers();
    }

    /* -------------------- Machine functions --------------------*/ 

    @Put(':id/machines')
    async addMachine(@Param('id') id: string, @Body() machine: Machine): Promise<Gym> {
        return this.gymService.addMachine(id, machine);
    }

    @Delete(':id/machines/:machineId')
    async removeMachine(@Param('id') id: string, @Param('machineId') machineId: string): Promise<Gym> {
        return this.gymService.removeMachine(id, machineId);
    }

    @Put(':id/machines/:machineId')
    async updateMachine(
        @Param('id') id: string,
        @Param('machineId') machineId: string,
        @Body() updateData: Partial<Machine>
    ): Promise<Gym> {
        return this.gymService.updateMachine(id, machineId, updateData);
    }

    /* -------------------- Gym related User functions --------------------*/ 

    @Post(':id/users/:userId')
    async addUser(@Param('id') id: string, @Param('userId') userId: string): Promise<Gym> {
        return this.gymService.addUser(id, new Types.ObjectId(userId));
    }

    @Delete(':id/users/:userId')
    async removeUser(@Param('id') id: string, @Param('userId') userId: string): Promise<Gym> {
        return this.gymService.removeUser(id, new Types.ObjectId(userId));
    }
}