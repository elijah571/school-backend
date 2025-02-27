import express from 'express';
import { createAttendance, deleteAttendance, getAttendanceWithStudentInfo, getSingleStudentAttendance, updateAttendance } from '../Controllers/attendance_controller.js';
import { authorize } from '../Middleware/authourize.js';

export const attendanceRoute = express.Router();

// Route for creating attendance for a specific classroom
// Now takes classroomId as part of URL params (e.g., /attendance/mark-attendance/:classroomId)
attendanceRoute.post('/:classroomId/mark-attendance', authorize, createAttendance);

// Route for updating attendance (attendanceId is passed as URL params)
attendanceRoute.put('/:attendanceId', authorize, updateAttendance);

// Route to get attendance for all students in a classroom
attendanceRoute.get('/:classroomId', getAttendanceWithStudentInfo);

// Route to get attendance for a specific student in a classroom
attendanceRoute.get('/:classroomId/:studentId', getSingleStudentAttendance);

// Route to delete attendance for a classroom
attendanceRoute.delete('/:classroomId', authorize, deleteAttendance);
