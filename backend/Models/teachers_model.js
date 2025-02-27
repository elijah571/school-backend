import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const teacherSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        phone: { type: String, required: true, unique: true, trim: true },
        subject: { type: String, required: true, trim: true },
        role: { type: String, default: "Teacher", required: true },
        isClassroom_Teacher: { type: Boolean, default: false },
       
    },
    { timestamps: true }
);

// Hash password before saving
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

// Compare password method
teacherSchema.methods.matchPassword = async function (enteredPassword) {
    return bcryptjs.compare(enteredPassword, this.password);
};

export const Teacher = mongoose.model("Teacher", teacherSchema);
