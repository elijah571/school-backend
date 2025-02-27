import mongoose from "mongoose";
import { type } from "os";
 const administrativeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: true},
    image: {type: String, required: true}

 }, {timestamps:true});

 export const Administrative = mongoose.model('Administrative', administrativeSchema)