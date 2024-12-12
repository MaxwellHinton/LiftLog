import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MachineDocument = HydratedDocument<Machine>;

@Schema()
export class Machine {
  @Prop({ required: true })
  machineName: string;

  @Prop({ type: [Number], default: [] })
  weightIncrements?: number[];

  @Prop({ type: [String], default: [] })
  tips?: string[];

  @Prop({ type: String, default: null })
  videoTutorial?: string; // can probably update to default to an icon saying video not available etc

  @Prop({
    type: {
      beginner: { type: Number, default: 0 },
      novice: { type: Number, default: 0 },
      intermediate: { type: Number, default: 0 },
      advanced: { type: Number, default: 0 },
      elite: { type: Number, default: 0 },
    },
    default: {},
  })
  stengthStandard?: {
    beginner: number;
    novice: number;
    intermediate: number;
    advanced: number;
    elite: number;
  };

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: String, required: true })
  image: string;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
