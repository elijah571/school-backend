import mongoose from "mongoose";

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",  // Reference to the Classroom model
        required: true
    },
    students: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Student", 
            required: true 
        }
    ],
    date: {
        type: Date,
        required: true,
    },
    attendanceStatus: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Student",
                required: true
            },
            status: {
                type: String, 
                enum: ['present', 'absent', 'late'], 
                required: true
            },
            checkIn: {
                type: String,
                required: function() { return this.status === 'present' || this.status === 'late'; }
            },
            checkOut: {
                type: String,
                required: function() { return this.status === 'present' || this.status === 'late'; }
            }
        }
    ]
}, { 
    timestamps: true 
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);

