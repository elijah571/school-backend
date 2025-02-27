import { Classroom } from "../Models/classRoom_model.js";
import { Student } from "../Models/student_model.js";
import { Attendance } from "../Models/attendance_model.js";  

// Create attendance for a classroom for the current day
export const createAttendance = async (req, res) => {
    try {
        const { classroomId } = req.params; // Classroom ID from params
        const { attendanceStatus } = req.body; // Attendance data from request body

        console.log('Creating attendance for classroomId:', classroomId);

        // Find the classroom by ID and populate students
        const classroom = await Classroom.findById(classroomId).populate('students');
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Check if attendance already exists for today (compare current date)
        const today = new Date();
        const existingAttendance = await Attendance.findOne({
            classroomId,
            date: { 
                $gte: new Date(today.setHours(0, 0, 0, 0)), // Start of the current day
                $lt: new Date(today.setHours(23, 59, 59, 999)) // End of the current day
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance for today has already been marked" });
        }

        // Create a new attendance record for today
        const attendance = new Attendance({
            classroomId,
            attendanceStatus,
            date: new Date() // Store the current date
        });

        console.log('Attendance object to save:', attendance);

        // Save the attendance record
        await attendance.save();

        // Return the populated attendance data with student details
        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('classroomId', 'name')
            .populate({
                path: 'attendanceStatus.student',
                select: 'name rollNo'
            });

        res.status(201).json({
            message: "Attendance created successfully for today",
            populatedAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// Update Attendance for a specific classroom
export const updateAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { attendanceStatus, checkIn, checkOut } = req.body;

        // Find the existing attendance record by ID
        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        // Update attendance status for specific students (handle it carefully if it's an array)
        if (attendanceStatus) {
            attendanceStatus.forEach(status => {
                const existingStudent = attendance.attendanceStatus.find(att => att.student.toString() === status.student.toString());
                if (existingStudent) {
                    existingStudent.status = status.status;  // Update status
                } else {
                    attendance.attendanceStatus.push(status);  // Add new status if not existing
                }
            });
        }

        if (checkIn) {
            attendance.checkIn = checkIn;
        }
        if (checkOut) {
            attendance.checkOut = checkOut;
        }

        // Save the updated attendance record
        await attendance.save();

        // Return classroom and student details along with the updated attendance status
        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('classroomId', 'name')  // Populate classroom details
            .populate({
                path: 'attendanceStatus.student',
                select: 'name rollNo'  // Populate student details (customize as needed)
            });

        res.status(200).json({
            message: "Attendance updated successfully",
            populatedAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Attendance for a specific classroom with student info
export const getAttendanceWithStudentInfo = async (req, res) => {
    try {
        const { classroomId } = req.params; // Get classroomId from params

        console.log('Getting attendance for classroomId:', classroomId);

        // Find the attendance for the given classroom and populate both classroom and student details
        const attendance = await Attendance.findOne({ classroomId })
            .populate('classroomId', 'name')  // Populate classroom details
            .populate({
                path: 'attendanceStatus.student'
            })
            .populate({
                path: 'classroomId.students', // Populate the students of the classroom as well
                select: 'name rollNo'  // Customize the fields you want to include from the student
            });

        if (!attendance) {
            return res.status(404).json({ message: `No attendance record found for classroom ID: ${classroomId}` });
        }

        res.status(200).json({
            message: "Attendance fetched successfully",
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// Get Attendance for a specific student in a classroom
export const getSingleStudentAttendance = async (req, res) => {
    try {
        const { classroomId, studentId } = req.params; // Extract classroomId and studentId

        // Find all attendance records for the given classroom where the student is listed
        const attendanceRecords = await Attendance.find({
            classroomId: classroomId,
            'attendanceStatus.student': studentId // Ensure student ID exists in attendanceStatus
        })
        .populate({
            path: 'attendanceStatus.student', // Populate the student details
            select: 'name email'  // Select specific fields if needed
        })
        .populate({
            path: 'classroomId', // Populate classroom details
            select: 'name grade' // Select specific fields if needed
        })
        .sort({ date: -1 }); // Sort by date in descending order

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: `No attendance records found for student ID: ${studentId} in classroom ID: ${classroomId}` });
        }

        // Extract only the student's attendance from each record
        const studentAttendance = attendanceRecords.map(record => {
            // Find the attendance status for the specific student
            const studentRecord = record.attendanceStatus.find(status => status.student._id.toString() === studentId);

            return {
                date: record.date,
                checkIn: studentRecord?.checkIn || "N/A",
                checkOut: studentRecord?.checkOut || "N/A",
                status: studentRecord?.status || "N/A",
                studentName: studentRecord?.student?.name || "Unknown",
                classroomName: record.classroomId?.name || "Unknown"
            };
        });

        res.status(200).json({
            message: "Student attendance records fetched successfully",
            studentAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// Delete Attendance for a specific classroom
export const deleteAttendance = async (req, res) => {
    try {
        const { classroomId } = req.params; // Get classroomId from params

        // Find and delete the attendance for the given classroom
        const deletedAttendance = await Attendance.findOneAndDelete({
            classroomId,
        });

        if (!deletedAttendance) {
            return res.status(404).json({ message: "No attendance found to delete for this classroom" });
        }

        res.status(200).json({
            message: "Attendance deleted successfully",
            deletedAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
