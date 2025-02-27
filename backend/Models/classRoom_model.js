import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    department: { type: String, required: true },
    term: {type: String, requried: true, default: "1st Term"},

    year: {type: String, requried: true,   default: "2024"},

    schedule: [
        {
            timeSlot: { type: String, required: true }, // e.g., "8:00 AM - 9:00 AM"
            days: {
                Monday: { type: String, default: null },  // Subject name or null
                Tuesday: { type: String, default: null },
                Wednesday: { type: String, default: null },
                Thursday: { type: String, default: null },
                Friday: { type: String, default: null },
            }
        }
    ],
    
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
}, { timestamps: true });

export const Classroom = mongoose.model("Classroom", classroomSchema);
