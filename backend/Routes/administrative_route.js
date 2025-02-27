import express from "express";
import ExpressFormidable from "express-formidable";
import { adminLogin, createAdmin, logoutAdmin, updateAdmin } from "../Controllers/Administative_controller.js";

export const adminRoute = express.Router();
//creat admin route
adminRoute.post('/signup',ExpressFormidable(),  createAdmin);
//Logged in Admin
adminRoute.post('/login', adminLogin );
//Log out Admi
adminRoute.post('/logout', logoutAdmin);
//update Admin profile
adminRoute.put("/:id", updateAdmin);