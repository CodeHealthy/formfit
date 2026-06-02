import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsageLogDocument = HydratedDocument<UsageLog>;

@Schema({
  timestamps: true,
})
export class UsageLog {
  @Prop({
    required: true,
    enum: ['image-fix'],
    index: true,
  })
  action!: 'image-fix';

  @Prop({
    index: true,
  })
  userId?: string;

  @Prop({
    index: true,
  })
  anonymousId?: string;

  @Prop({
    required: true,
    index: true,
  })
  dayKey!: string;

  @Prop({
    required: true,
  })
  plan!: 'guest' | 'free' | 'pro';
}

export const UsageLogSchema = SchemaFactory.createForClass(UsageLog);
