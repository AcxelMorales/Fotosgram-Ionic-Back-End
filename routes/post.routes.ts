import { Router } from 'express';

import { verifyToken } from '../middlewares/auth';
import * as postController from '../controllers/post.controller';

const postRoutes = Router();

//****************************************************************************
//  GET POSTS - PAGINATION
//****************************************************************************
postRoutes.get('/list', postController.getAll);

//****************************************************************************
//  CREATE POST IN MONGODB
//****************************************************************************
postRoutes.post('/create', verifyToken, postController.post);

//****************************************************************************
//  UPLOAD FILES - IMG
//****************************************************************************
postRoutes.post('/upload', verifyToken, postController.upload);

//****************************************************************************
//  GET IMAGE
//****************************************************************************
postRoutes.get('/image/:userid/:img', verifyToken, postController.getImage);

export default postRoutes;