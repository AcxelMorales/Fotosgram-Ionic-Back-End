import { Response, Request } from "express";

import { Post } from "../models/post.model";
import { IFileUpload } from '../interfaces/file';
import FileSystem from "../classes/file-system";

const fileSystem: FileSystem = new FileSystem();

//****************************************************************************
// GET POSTS - PAGINATION
//****************************************************************************
export const getAll = async (req: Request, res: Response) => {
  let page = Number(req.query.page) || 1;
  let skip = page - 1;
  skip *= 10; 

  const posts = await Post.find().sort({ _id: -1 }).skip(skip).limit(10).populate('user', '-password').exec();

  // if (posts.length === 0) {
  //   return res.status(200).json({
  //     ok     : true,
  //     message: 'There are no items in the collection'
  //   });
  // }

  res.json({
    ok: true,
    page,
    posts
  });
}

//****************************************************************************
//  CREATE POST IN MONGODB
//****************************************************************************
export const post = async (req: any, res: Response) => {
  const body = req.body;
  body.user  = req.user._id;

  const images = fileSystem.imagesTempPost(req.user._id);
  body.img = images;

  try {
    const postDB = await Post.create(body);

    await postDB.populate('user', '-password').execPopulate();

    res.status(201).json({
      ok  : true,
      post: postDB
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      error
    });
  }
}

//****************************************************************************
//  UPLOAD FILES - IMG
//****************************************************************************
export const upload = async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok     : false,
      message: 'No files have been uploaded'
    });
  }

  const file: IFileUpload = req.files.image;

  if (!file) {
    return res.status(400).json({
      ok     : false,
      message: 'The image field is null'
    });
  }

  if (!file.mimetype.includes('image')) {
    return res.status(400).json({
      ok     : false,
      message: 'Valid formats (jpg, jpeg, png, gif)'
    });
  }

  const resp = await fileSystem.saveImageTemp(file, req.user._id);

  res.json({
    ok: true,
    resp
  });
}

//****************************************************************************
//  GET IMAGE
//****************************************************************************
export const getImage = async (req: Request, res: Response) => {
  const userId: string = req.params.userid;
  const img: string    = req.params.img;

  const pathPhoto = fileSystem.getPhotoUrl(userId, img);
  res.sendFile(pathPhoto);
}