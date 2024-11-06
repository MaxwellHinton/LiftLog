import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Gym, GymDocument } from './gym.schema';
import { CreateGymDto } from './create-gym.dto';
import { Machine } from './machine.schema';

@Injectable()
export class GymService{
    constructor(
        @InjectModel(Gym.name) private gymModel: Model<GymDocument>,
    ) {}

    
    // Create a gym
    async createGym(gymDto: CreateGymDto): Promise<Gym> {
        const newGym = new this.gymModel(gymDto);
        return newGym.save();
    }

    // add machine to gym
    async addMachine(gymId: string, machine: Machine): Promise<Gym> {
        return this.gymModel.findByIdAndUpdate(
            gymId,
            { $push: { machines: machine } },
            { new: true}
        ).exec()
    }

    // add user to gym
    async addUser(gymId: string, userId: Types.ObjectId): Promise<Gym> {
        return this.gymModel.findByIdAndUpdate(
            gymId,
            { $push: { users: userId} },
            { new: true }
        ).exec();
    }

    
    
}