import { Teacher } from "../Models/teachers_model.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../Utils/generateToken.js";

// ✅ Create Teacher
export const createTeacher = async (req, res) => {
    const { fullName, gender, email, password, phone, subject, isClassroom_Teacher } = req.fields;
    try {
        if (!fullName || !gender || !email || !password || !phone || !subject ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const teacherExists = await Teacher.findOne({ email });
        if (teacherExists) {
            return res.status(400).json({ message: "Teacher already exists" });
        }

        const newTeacher = new Teacher({
            fullName,
            gender,
            email,
            password,
            phone,
            subject,
            isClassroom_Teacher,
        });

        await newTeacher.save();

        res.status(201).json({ message: "Teacher created successfully", teacher: newTeacher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get All Teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().select("-password");
        res.status(200).json({ teachers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get Single Teacher by ID
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).select("-password");
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ teacher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Teacher Login
export const teacherLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await teacher.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        generateToken(res, { id: teacher._id });

        res.status(200).json({
            message: "Login successful",
            teacher: {
                id: teacher._id,
                fullName: teacher.fullName,
                email: teacher.email,
                phone: teacher.phone,
                subject: teacher.subject,
                image: teacher.image,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Logout Teacher
export const logoutTeacher = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Teacher logged out successfully" });
};

// ✅ Update Teacher
export const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        if (req.body.fullName) teacher.fullName = req.body.fullName;
        if (req.body.email) teacher.email = req.body.email;
        if (req.body.phone) teacher.phone = req.body.phone;
        if (req.body.subject) teacher.subject = req.body.subject;
        if (req.body.isClassroom_Teacher !== undefined) {
            teacher.isClassroom_Teacher = Boolean(req.body.isClassroom_Teacher);
        }
        if (req.body.password) {
            teacher.password = await bcryptjs.hash(req.body.password, 10);
        }

        await teacher.save();

        res.status(200).json({
            message: "Teacher updated successfully",
            teacher: {
                id: teacher._id,
                fullName: teacher.fullName,
                email: teacher.email,
                phone: teacher.phone,
                subject: teacher.subject,
                isClassroom_Teacher: teacher.isClassroom_Teacher,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Delete Teacher
export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        await teacher.deleteOne();
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
