import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { GymService } from '../gyms/gym.service';

@Injectable()
export class GymUserService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly gymService: GymService,
    ) {}

    async addUserToGym(userId: string, gymId: string): Promise<void> {
        // Add the user to the gym's users array
        await this.gymService.addUser(gymId, userId);

        // Update the user's currentGym field
        await this.userService.updateUser(userId, { currentGym: gymId });
    }

    async removeUserFromGym(userId: string, gymId: string): Promise<void> {
        // Remove the user from the gym's users array
        await this.gymService.removeUser(gymId, userId);

        // Remove the user's currentGym field
        await this.userService.updateUser(userId, { currentGym: "" });
    }
}
