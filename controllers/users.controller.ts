import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import { User } from '../models/user.model';
import Token from '../classes/token';

//****************************************************************************
//  LOGIN
//****************************************************************************
export const login = (req: Request, res: Response) => {
  const body = req.body;

  User.findOne({email: body.email}, (err, userDB) => {
    if (err) throw err;

    if (!userDB) {
      return res.status(404).json({
        ok     : false,
        message: 'Username/Password are not correct'
      });
    }

    if (userDB.equalsPassword(req.body.password)) {
      const userToken = Token.getJwtToken({
        _id   : userDB._id,
        name  : userDB.name,
        email : userDB.email,
        avatar: userDB.avatar
      });

      res.status(200).json({
        ok   : true,
        token: userToken
      });
    } else {
      return res.status(404).json({
        ok     : false,
        message: 'Username/Password are not correct ***'
      });
    }
  });
}

//****************************************************************************
//  CREATE USER IN MONGODB
//****************************************************************************
export const post = async (req: Request, res: Response) => {
  const user = {
    name    : req.body.name,
    email   : req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar  : req.body.avatar
  };

  try {
    const userDB = await User.create(user);

    const userToken = Token.getJwtToken({
      _id   : userDB._id,
      name  : userDB.name,
      email : userDB.email,
      avatar: userDB.avatar
    });

    res.status(201).json({
      ok   : true,
      token: userToken
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      error
    });
  }
}

//****************************************************************************
//  UPDATE A RECORD IN MONGODB
//****************************************************************************
export const put = async (req: any, res: Response) => {
  // const user = {
  //   name  : req.body.name   || req.user.name,
  //   email : req.body.email  || req.user.email,
  //   avatar: req.body.avatar || req.user.avatar
  // };

  // User.findOneAndUpdate(req.user._id, user, {
  //   new: true
  // }, (err, userDB) => {
  //   if (err) throw err;

  //   if (!userDB) {
  //     return res.status(400).json({
  //       ok     : false,
  //       message: 'There is no user with that ID'
  //     });
  //   }

  //   const userToken = Token.getJwtToken({
  //     _id   : userDB._id,
  //     name  : userDB.name,
  //     email : userDB.email,
  //     avatar: userDB.avatar
  //   });

  //   res.status(200).json({
  //     ok   : true,
  //     token: userToken
  //   });
  // });

  try {
    await User.updateOne({
      _id: req.user._id
    }, {
      $set: {
        name  : req.body.name   || req.user.name,
        email : req.body.email  || req.user.email,
        avatar: req.body.avatar || req.user.avatar
      }
    });

    const userToken = Token.getJwtToken({
      _id   : req.user._id,
      name  : req.user.name,
      email : req.user.email,
      avatar: req.user.avatar
    });

    res.status(200).json({
      ok   : true,
      token: userToken
    });
  } catch (error) {
    return res.status(400).json({
      ok     : false,
      message: 'There is no user with that ID',
      error
    });
  }
}