import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type UserPlan = 'free' | 'pro';

export type UserRole = 'user' | 'admin';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  passwordHash!: string;

  @Prop({
    enum: ['user', 'admin'],
    default: 'user',
  })
  role!: UserRole;

  @Prop({
    enum: ['free', 'pro'],
    default: 'free',
  })
  plan!: UserPlan;

  @Prop()
  stripeCustomerId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);