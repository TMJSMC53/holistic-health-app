import Mongoose from 'mongoose';

const UserSchema = new Mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
});

const User = Mongoose.model('user', UserSchema, 'users');

export default User;
