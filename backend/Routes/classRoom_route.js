import express from "express";
import { 
    createClassroom, 
    assignTeachersToClassroom, 
    addSubjectToSchedule, 
    addStudentsToClassroom, 
    getAllClassrooms, 
    getClassroom, 
    updateClassroom, 
    deleteClassroom 
} from "../Controllers/classRoom_controller.js";
import { authorizeAdmin } from "../Middleware/authourize.js";

export const classRoomRoute = express.Router();

// Create a classroom
classRoomRoute.post('/create', authorizeAdmin, createClassroom);

// Assign subjects to a classroom schedule
classRoomRoute.post('/assign-subjects/:classroomId', authorizeAdmin, addSubjectToSchedule);

// Assign a teacher to a classroom
classRoomRoute.post('/assign-teacher/:classroomId/', authorizeAdmin, assignTeachersToClassroom);

// Assign students to a classroom
classRoomRoute.post('/assign-students/:classroomId', authorizeAdmin, addStudentsToClassroom);

// Get all classrooms
classRoomRoute.get('/', getAllClassrooms);

// Get a specific classroom by ID
classRoomRoute.get('/:classroomId', getClassroom);

// Update a classroom
classRoomRoute.put('/update/:classroomId', authorizeAdmin, updateClassroom);

// Delete a classroom
classRoomRoute.delete('/delete/:classroomId', authorizeAdmin, deleteClassroom);
