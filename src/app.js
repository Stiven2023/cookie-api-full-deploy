import express from 'express';
import morgan from 'morgan';
import pkg from '../package.json'
import fileUpload from 'express-fileupload';
import cors from 'cors';

import { createRoles } from './libs/initialSetup.js';

// ROUTES IMPORTS
import authRoutes from './routes/user/auth.routes.js';
import userRoutes from './routes/user/user.routes.js';
import profileRoutes from './routes/user/profile.routes.js';
import chatRoutes from './routes/chat/ChatRoutes.js';
import messageRoutes from './routes/chat/MessageRoutes.js';

// SERVER INITIALIZATION
const app = express();
createRoles();

app.set('pkg', pkg);

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp'
}));

// ROUTES
app.get('/', (req, res) => {
  res.json({
    name: app.get('pkg').name,
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version,
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat/messages', messageRoutes);

export default app;