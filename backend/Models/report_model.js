import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student", 
        required: true 
    },
    classroom: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Classroom", 
        required: true 
    },
    term: { 
        type: String, 
        required: true 
    },
    firstCA: {
        subjects: [
            {
                subjectName: { type: String, required: true },
                score: { type: Number, required: true },
                grade: { type: String }, // Grade per subject
                teacherComments: { type: String, default: "" }
            }
        ]
    },
    secondCA: {
        subjects: [
            {
                subjectName: { type: String, required: true },
                score: { type: Number, required: true },
                grade: { type: String },
                teacherComments: { type: String, default: "" }
            }
        ]
    },
    exam: {
        subjects: [
            {
                subjectName: { type: String, required: true },
                score: { type: Number, required: true },
                grade: { type: String },
                teacherComments: { type: String, default: "" }
            }
        ]
    },
    total: { 
        type: Number,  
        required: true 
    },
    totalGrade: { 
        type: String, 
        enum: ["A", "B", "C", "D", "F"],  
        required: true 
    },
    teacherRemarks: { 
        type: String, 
        default: "" 
    }
}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);
