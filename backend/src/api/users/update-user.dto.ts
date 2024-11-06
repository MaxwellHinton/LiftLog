// src/users/dto/update-user-profile.dto.ts
import { IsString, IsOptional, IsInt, IsArray, IsObject, IsUrl } from 'class-validator';

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

  @IsInt()
  @IsOptional()
  weight?: number;

  @IsUrl()
  @IsOptional()
  profilePicture?: string;

  @IsObject()
  @IsOptional()
  goals?: {
    longTermGoal?: string;
    consistency?: number;
    machineGoals?: {
      [machineId: string]: MachineLogDto
    };
  };

}
