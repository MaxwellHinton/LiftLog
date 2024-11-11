import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

// Gym machine class is created here because each gym will contain
// a list of machines that have their data embedded.
class MachineDto {
  @IsString()
  @IsNotEmpty()
  machineName: string;

  @IsArray()
  @IsOptional()
  weightIncrements?: number[];

  @IsString()
  @IsArray()
  @IsOptional()
  tips?: string[]; // Array because there could be multiple tips and retrieval is easier.

  @IsString()
  @IsOptional()
  videoTutorial?: string; // The string will be the URL reference.

  // Strength standards will use the strengthstandard API or we just scrape the data/rax their calculator
  // we only want to give info to the user on what category the sit. We dont need their ranking at their bodyweight etc.
  @IsOptional()
  strengthStandard?: {
    beginner: number;
    novice: number;
    intermediate: number;
    advanced: number;
    elite: number;
  };
}

// Gyms contain:
// The name, a list of machines, and a list of users.
export class CreateGymDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  // location: string; maybe for future use.

  // The machine array validates that all machines are machineDto's providing another layer of variable checking.
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MachineDto)
  machines: MachineDto[];

  @IsArray()
  @IsOptional()
  users?: Types.ObjectId[];
}
