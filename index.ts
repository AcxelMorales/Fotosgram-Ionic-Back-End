import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'; 

import Server from './classes/server';
import userRoutes from './routes/users.routes';
import postRoutes from './routes/post.routes';

const server    : Server = new Server();
const URL_SERVER: string = '/api/v1/ft';
const URL_DB    : string = 'mongodb://localhost:27017/fotosgram';

//****************************************************************************
//  MIDDLEWARES
//****************************************************************************
server.app.use(bodyParser.urlencoded({
  extended: true
}));

server.app.use(bodyParser.json());

server.app.use(fileUpload());

//****************************************************************************
//  ROUTES
//****************************************************************************
server.app.use(`${URL_SERVER}/users`, userRoutes);
server.app.use(`${URL_SERVER}/posts`, postRoutes);

//****************************************************************************
//  DATABASE
//****************************************************************************
mongoose.connect(URL_DB, {
  useNewUrlParser   : true,
  useCreateIndex    : true,
  useUnifiedTopology: true
}, (err) => {
  if (err) throw err;
  console.log('DB online');
});

//****************************************************************************
//  LISTENER
//****************************************************************************
server.start(() => console.log(`Server online in port ${server.port}`));