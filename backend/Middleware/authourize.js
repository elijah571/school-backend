import jwt from 'jsonwebtoken';
import { Administrative } from '../Models/administative.js';
import { Teacher } from '../Models/teachers_model.js';
// Middleware to authorize only admins
export const authorizeAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Administrative.findById(decodedToken.id);

        if (!admin || !admin.isAdmin) { 
            return res.status(403).json({ message: "Access denied. Admins only" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const authorizeTeacher = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const teacher = await Teacher.findById(decodedToken.id);

        if (!teacher) { 
            return res.status(403).json({ message: "Access denied. teachers  only" });
        }

        req.teacher = teacher;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}


// Middleware to authorize Admins and Teachers
export const authorize = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check for Admin
        const admin = await Administrative.findById(decodedToken.id);
        if (admin && admin.isAdmin) {
            req.admin = admin;
            return next(); // Admin has access, move to next middleware
        }

        // Check for Teacher
        const teacher = await Teacher.findById(decodedToken.id);
        if (teacher) {
            req.teacher = teacher;
            return next(); // Teacher has access, move to next middleware
        }

        // If neither Admin nor Teacher found
        return res.status(403).json({ message: "Access denied. Admins or Teachers only" });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Middleware to authorize classroom teachers only
export const authorizeClassroomTeacher = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const teacher = await Teacher.findById(decodedToken.id);

        if (!teacher || !teacher.isClassroom_Teacher) { 
            return res.status(403).json({ message: "Access denied. Classroom teachers only" });
        }

        req.teacher = teacher;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
