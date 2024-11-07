import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gym, GymDocument } from './gym.schema';
import { CreateGymDto } from './create-gym.dto';
import { Machine } from './machine.schema';

@Injectable()
export class GymService{
    constructor(
        @InjectModel(Gym.name) private gymModel: Model<GymDocument>,
    ) {}

    /* -------------------- Gym queries -------------------- */
    
    // Create a gym
    async createGym(gymDto: CreateGymDto): Promise<Gym> {
        const newGym = new this.gymModel(gymDto);
        return await newGym.save();
    }

    // get a gym WITHOUT user information
    async getGymById(gymId: string): Promise<Gym> {
        return this.gymModel.findById(gymId).exec();
    }

    // get a gym WITH user information
    async getGymByIdWithUsers(gymId: string): Promise<Gym> {
        return this.gymModel.findById(gymId).populate('users').exec();
    }

    // get all gyms WITHOUT user information
    async getAllGyms(): Promise<Gym[]> {
        return this.gymModel.find().exec();
    }

    // get all gyms WITH user information
    async getAllGymsWithUsers(): Promise<Gym[]> {
        return this.gymModel.find().populate('users').exec();
    }

    /* -------------------- Machine queries --------------------*/

    // add machine to gym
    async addMachine(gymId: string, machine: Machine): Promise<Gym> {
        return this.gymModel.findByIdAndUpdate(
            gymId,
            { $push: { machines: machine } },
            { new: true}
        ).exec()
    }

    //remove machine from gym
    async removeMachine(gymId: string, machineId: string): Promise<Gym> {
        return this.gymModel.findByIdAndUpdate(
            gymId,
            { $pull: { machines: { _id: machineId } } },
            { new: true }
        ).exec();
    }

    //update machine in gym
    async updateMachine(gymId: string, machineId: string, updateData: Partial<Machine>): Promise<Gym> {
        return this.gymModel.findOneAndUpdate(
            { _id: gymId, 'machines._id': machineId },
            { $set: { 'machines.$': updateData } },
            { new: true }   
        ).exec();
    }

    // /* -------------------- Gym related User queries --------------------*/ 
    
    // add user to gym
    async addUser(gymId: String, userId: String): Promise<Gym> {
        return this.gymModel.findByIdAndUpdate(
            gymId,
            { $push: { users: userId} },
            { new: true }
        ).exec();
    }

    // remove user from gym
    async removeUser(gymId: String, userId: String): Promise<Gym> {
        return this.gymModel.findByIdAndUpdate(
            gymId,
            { $pull: { users: userId } },
            {new: true}
        ).exec();
    }
}