import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

//****************************************************************************
//  SCHEMA IN MONGODB
//****************************************************************************
const userSchema = new Schema({
  name: {
    type     : String,
    required : [true, 'The name is necessary.'],
    maxlength: 99,
    trim     : true
  },
  avatar: {
    type   : String,
    default: 'av-1.png'
  },
  email: {
    type    : String,
    unique  : true,
    required: [true, 'Mail is necessary'],
    trim    : true
  },
  password: {
    type     : String,
    required : [true, 'Password is required'],
    minlength: 6
  }
});

//****************************************************************************
//  EQUALS PASSWORD
//****************************************************************************
userSchema.method('equalsPassword', function(password: string = ''): boolean {
  return (bcrypt.compareSync(password, this.password)) ? true : false;
});

//****************************************************************************
//  USER INTERFACE
//****************************************************************************
interface IUser extends Document {
  name    : string;
  email   : string
  password: string;
  avatar ?: string;

  equalsPassword(password: string): boolean;
}

export const User = model<IUser>('user', userSchema);