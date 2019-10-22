import { Router } from "express";

import { verifyToken } from '../middlewares/auth';
import * as userController from '../controllers/users.controller';

const userRoutes = Router();

//****************************************************************************
//  LOGIN
//****************************************************************************
userRoutes.post('/login', userController.login);

//****************************************************************************
//  CREATE USER IN MONGODB
//****************************************************************************
userRoutes.post('/create', userController.post);

//****************************************************************************
//  UPDATE A RECORD IN MONGODB
//****************************************************************************
userRoutes.put('/update', verifyToken, userController.put);

export default userRoutes;