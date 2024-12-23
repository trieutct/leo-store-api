import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class BaseSchema {
  _id: Types.ObjectId;

  @Prop({ required: true, default: null })
  createdBy: string;

  @Prop({ required: true, default: null })
  updatedBy: string;

  @Prop()
  deletedBy?: string;

  createdAt: Date;

  updatedAt: Date;

  @Prop()
  deletedAt?: Date;

  @Prop()
  deleted?: boolean;
}
