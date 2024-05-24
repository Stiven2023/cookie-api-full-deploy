import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

mongoose.connect(process.env.MONGODB_URI)
    .then(db => console.log('Connected to the database'))
    .catch(error => console.log('Error connecting to the database', error));