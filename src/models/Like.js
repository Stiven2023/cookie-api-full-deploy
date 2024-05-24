import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const likeSchema = new Schema({
 type: mongoose.Schema.Types.ObjectId,
 user: userSchema,
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;