import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Machine, MachineSchema } from './machine.schema';

export type GymDocument = HydratedDocument<Gym>;

@Schema()
export class Gym {
    @Prop({ required: true})
    name: string;

    @Prop({ type: [MachineSchema], default: []})
    machines?: Machine[]

    @Prop({ type: [Types.ObjectId], ref: 'User', default: []})
    users?: Types.ObjectId[];
}

export const GymSchema = SchemaFactory.createForClass(Gym);