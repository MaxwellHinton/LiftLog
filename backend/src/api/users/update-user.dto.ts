// src/users/dto/update-user-profile.dto.ts
import { IsString, IsOptional, IsInt, IsObject, IsUrl, IsNotIn, IsNumber } from 'class-validator';

class MachineLogDto {
  @IsInt()
  @IsOptional()
  currentWeight?: number;

  @IsInt()
  @IsOptional()
  currentReps?: number;

  @IsInt()
  @IsOptional()
  currentGoal?: number;

  @IsInt()
  @IsOptional()
  incrementWeight?: number;
}

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  currentGym?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsUrl()
  @IsOptional()
  profilePicture?: string;

  @IsObject()
  @IsOptional()
  goals?: {
    longTermGoal?: string;
    consistency?: number; // days per week you want to workout
    machineGoals?: {
      [machineId: string]: MachineLogDto;
    };
  };
}
