import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// MachineLog schema contains everything present in the machinelogDto
@Schema()
class MachineLog {
  @Prop({ type: Number, default: 0 })
  currentWeight: number;

  @Prop({ type: Number, default: 0 })
  currentReps: number;

  @Prop({ type: Number, default: 0 })
  currentGoal: number;

  @Prop({ type: Number, default: 0 })
  incrementWeight: number;
}

const MachineLogSchema = SchemaFactory.createForClass(MachineLog);

@Schema()
class Goals {
  @Prop({ type: String, default: null })
  longTermGoal: string;

  // consistency means how many days per week you want to hit the gym
  @Prop({ type: Number, default: null })
  consistency: number;

  // each string is a machine ID, MachineLog contains the goals for that machine.
  @Prop({ type: Map, of: MachineLogSchema, default: {} })
  machineGoals?: Map<string, MachineLog>;
}

@Schema()
export class User {
  @Prop({ type: String, required: true })
  yourName: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: String, required: true })
  gender: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: String })
  profilePicture?: string;

  @Prop({ type: String, ref: 'Gym', default: '' })
  currentGym?: string;

  @Prop({ type: Goals, default: {} })
  goals: Goals;
}

export const UserSchema = SchemaFactory.createForClass(User);
