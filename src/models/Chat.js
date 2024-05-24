import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]
}, {
  timestamps: true,
  versionKey: false,
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
