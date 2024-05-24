import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const commentSchema = new Schema({
 type: mongoose.Schema.Types.ObjectId,
 content: {
   type: String,
   required: true,
 },
 date: {
   type: Date,
   default: Date.now,
 },
 user: {
   type: Schema.Types.ObjectId,
   ref: 'User',
   required: true,
 }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;