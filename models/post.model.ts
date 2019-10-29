import { Schema, model, Document } from 'mongoose';
import { NextFunction } from 'express';

//****************************************************************************
//  SCHEMA IN MONGODB
//****************************************************************************
const postSchema = new Schema({
  createdAt: {
    type: Date
  },
  message: {
    type: String,
    trim: true
  },
  img: [{
    type: String
  }],
  coords: {
    type: String
  },
  user: {
    type    : Schema.Types.ObjectId,
    ref     : 'user',
    required: [true, 'No reference']
  }
});

//****************************************************************************
//  PRE CODE - PRE ACTIONS CODE
//****************************************************************************
postSchema.pre<IPost>('save', function(next: NextFunction) {
  this.createdAt = new Date();
  next();
});

//****************************************************************************
//  POST INTERFACE
//****************************************************************************
interface IPost extends Document {
  createdAt: Date,
  message  : string,
  img      : string[],
  coords   : string,
  user     : string
}

export const Post = model<IPost>('post', postSchema);