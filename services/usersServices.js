import { model, Schema } from "mongoose";

const usersSchema = Schema({
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    avatarURL: String,
    token: {
      type: String,
      default: null,
    },
  })

  export const User = model('User', usersSchema);