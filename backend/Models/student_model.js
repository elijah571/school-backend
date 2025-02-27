import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    role: { type: String, default: "Student", required: true, enum: ["Student"] },
    parent: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { 
      type: String, 
      required: true, 
      unique: true, 
     
    },
    DOB: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);