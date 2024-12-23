import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { RoleType } from 'src/users/user.constants';

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true })
  name: String;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: '' })
  address: string;

  @Prop({ required: false, default: '' })
  phone?: string;

  @Prop({ required: true, default: RoleType.USER, enum: RoleType })
  role: RoleType;
}

export const UserSchema = SchemaFactory.createForClass(User);
