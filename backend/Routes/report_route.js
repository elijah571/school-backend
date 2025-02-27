import express from 'express';
import {
     createReport, 
     deleteAllReports, 
     deleteStudentReport, 
     getAllReports, 
     getStudentReportById, 
     // updateAllReports, 
     updateStudentReport
     } from '../Controllers/report_controller.js';
import { authorize } from '../Middleware/authourize.js';

export const reportRoute = express.Router()

//create report

reportRoute.post('/', authorize, createReport);
//get all report
reportRoute.get('/',  getAllReports);
//get a student report
reportRoute.get('/:studentId', authorize, getStudentReportById)
//Update all reports
// reportRoute.put('/', authorize, updateAllReports);
reportRoute.put('/:studentId', authorize, updateStudentReport)
//Delete all report
reportRoute.delete('/', authorize, deleteAllReports)
//Delete a student report
reportRoute.delete('/:studentId', authorize, deleteStudentReport)