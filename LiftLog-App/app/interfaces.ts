// interfaces.ts contains the user DTO structures

export interface RegisterUserDto {
    username: string;
    firstname: string;
    lastname: string;
    age: number;
    gender: string;
    email: string;
    password: string;
}

// interfaces.ts
export interface MachineLogDto {
    currentWeight?: number;
    currentReps?: number;
    currentGoal?: number;
    incrementWeight?: number;
}
  
  export interface UpdateUserProfileDto {
    currentGym?: string;
    weight?: number;
    profilePicture?: string;
    goals?: {
      longTermGoal?: string;
      consistency?: number;
      machineGoals?: {
        [machineId: string]: MachineLogDto;
      };
    };
}

// Gym interface for the gym selection process.
export interface GymDisplay {
    _id: string;
    name: string;
    address? : string
    imageUrl?: string;
}

const interfaces = {};
  
  export default interfaces;

  