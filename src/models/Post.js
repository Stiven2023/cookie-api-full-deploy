import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema(
 {
   content: {
     type: String,
     required: true,
   },
   image: {
     type: String,
     required: false,
   },
   user: {
     type: Schema.Types.ObjectId,
     ref: 'User',
     required: true,
   },
   likes: [{
     type: Schema.Types.ObjectId,
     ref: 'Like',
   }],
   comments: [{
     type: Schema.Types.ObjectId,
     ref: 'Comment',
   }],
 },
 {
   timestamps: true,
 }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;