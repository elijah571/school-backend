import { Classroom } from "../Models/classRoom_model.js";
import { Teacher } from "../Models/teachers_model.js";
import { Student } from "../Models/student_model.js";

// Create a new Classroom
export const createClassroom = async (req, res) => {
    try {
        const { name, gradeLevel, department } = req.body;

        if (!name || !gradeLevel || !department) {
            return res.status(400).json({ message: "Classroom name, grade level, and department are required" });
        }

        const classroom = new Classroom({
            name,
            gradeLevel,
            department,
            schedule: [],
            students: [],
            teachers: []
        });

        await classroom.save();
        res.status(201).json({ message: "Classroom created successfully", classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Assign Teachers to a Classroom
export const assignTeachersToClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { teacherIds } = req.body;

        if (!teacherIds || !Array.isArray(teacherIds)) {
            return res.status(400).json({ message: "An array of teacher IDs is required" });
        }

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        const teachers = await Teacher.find({ '_id': { $in: teacherIds } });
        if (teachers.length !== teacherIds.length) {
            return res.status(404).json({ message: "One or more teachers not found" });
        }

        classroom.teachers = [...new Set([...classroom.teachers, ...teacherIds])];

        await classroom.save();
        res.status(200).json({ message: "Teachers assigned to classroom successfully", classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Add or Update a Subject in the Classroom Schedule
export const addSubjectToSchedule = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { timeSlot, subjects } = req.body;

        if (!timeSlot || !subjects) {
            return res.status(400).json({ message: "Time slot and subjects for each day are required" });
        }

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        let scheduleEntry = classroom.schedule.find(slot => slot.timeSlot === timeSlot);

        if (scheduleEntry) {
            scheduleEntry.days = { ...scheduleEntry.days, ...subjects };
        } else {
            classroom.schedule.push({ timeSlot, days: subjects });
        }

        await classroom.save();
        res.status(200).json({ message: "Schedule updated successfully", classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Add Students to Classroom
export const addStudentsToClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { studentIds } = req.body;

        if (!studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ message: "An array of student IDs is required" });
        }

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        const students = await Student.find({ '_id': { $in: studentIds } });
        if (students.length !== studentIds.length) {
            return res.status(404).json({ message: "One or more students not found" });
        }

        classroom.students = [...new Set([...classroom.students, ...studentIds])];

        await classroom.save();
        res.status(200).json({ message: "Students added to classroom successfully", classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all Classrooms with Students and Teachers
export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
            .populate('students')
            .populate('teachers');

        if (!classrooms.length) {
            return res.status(404).json({ message: "No classrooms found" });
        }

        res.status(200).json({ classrooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get a Single Classroom
export const getClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;

        const classroom = await Classroom.findById(classroomId)
            .populate('students')
            .populate('teachers');

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        res.status(200).json({ classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Classroom Details (Name, Grade, Department)
export const updateClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { name, gradeLevel, department } = req.body;

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        if (name) classroom.name = name;
        if (gradeLevel) classroom.gradeLevel = gradeLevel;
        if (department) classroom.department = department;

        await classroom.save();
        res.status(200).json({ message: "Classroom updated successfully", classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a Classroom
export const deleteClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;

        const classroom = await Classroom.findByIdAndDelete(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        res.status(200).json({ message: "Classroom deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
