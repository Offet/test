//  import module for the user model
import { Schema, model } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json";

//  create a new user model

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    otherNames: { type: String },
    email: { type: String, required: true, unique: true, },
    password: { type: String },
    userName: { type: String, unique: true },
   // confirmPassword: { type: String },
    theme: {type: String, default: "light"},
    termsAndconditions: { type: String },
    role: { type: String, default: 'user', enum: ['superadmin', 'admin', 'manager', 'user'] }
}, {
    timestamps: true
});

//  use plugins for the ids
userSchema.plugin(toJSON);


// export the model
export const User = model("User", userSchema);