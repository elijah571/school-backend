import express from "express";
import { authorize, authorizeAdmin } from "../Middleware/authourize.js";
import ExpressFormidable from "express-formidable";
import { createTeacher, deleteTeacher, getAllTeachers, getTeacherById, logoutTeacher, teacherLogin, updateTeacher } from "../Controllers/teacher_controller.js";

export const teachers_route = express.Router()
//Route to create a teacher
teachers_route.post('/create', ExpressFormidable(), authorizeAdmin, createTeacher);
//Login teacher
teachers_route.post('/login', teacherLogin);
teachers_route.post('/logout', logoutTeacher);
//Route to ge all Teachers
teachers_route.get('/', getAllTeachers);
//Get a specific teacher by id
teachers_route.get('/:id', getTeacherById);
//teacher route to update teacher
teachers_route.put('/:id', authorize, updateTeacher);
//Delte teacher
teachers_route.delete('/:id', authorizeAdmin, deleteTeacher)