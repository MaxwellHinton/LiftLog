// interfaces.ts contains the user DTO structures

export interface RegisterUserDto {
    yourName: string,
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
  unitWeight?: string;
  profilePicture?: string;
  goals?: {
    longTermGoal?: string;
    consistency?: number;
    machineGoals?: {
      [machineId: string]: MachineLogDto;
    };
  };
}

export interface UserGoals {
  longTermGoal?: string;
  consistency?: number;
  machineGoals: {
    [machineId: string]: MachineLogDto;
  };
}

export interface UserData {
  _id: string;
  age: number;
  currentGym: string;
  email: string;
  gender: string;
  goals: UserGoals;
  password: string;
  yourName: string;
  profilePicture: string;
  weight: number;
  unitWeight: string;
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