import { Student } from "../Models/student_model.js";
// Create Student

// In your student_controller.js

export const createStudent = async (req, res) => {
    try {
      const { fullName, gender, parent, email, phone, DOB, address } = req.fields;
      // If an image file is uploaded via Express Formidable, it'll be in req.files.
      // Otherwise, fall back to the image URL from req.fields (provided by your separate upload API).
      const image = req.files?.image ? req.files.image.path : req.fields.image;
  
      if (!fullName || !gender || !parent || !email || !phone || !DOB || !address || !image) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingStudent = await Student.findOne({ email: email.toLowerCase().trim() }).select("_id");
      if (existingStudent) {
        return res.status(400).json({ message: "Email already in use" });
      }
  
      const student = new Student({
        fullName,
        gender,
        role: "Student",
        parent,
        email: email.toLowerCase().trim(),
        phone,
        DOB,
        address,
        image,
      });
  
      await student.save();
      res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
// Get All Students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Student by ID
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete Student
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Student
export const updateStudent = async (req, res) => {
    try {
        const { fullName, gender, parent, email, phone, DOB, address, image } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                fullName,
                gender,
                parent,
                email: email ? email.toLowerCase().trim() : undefined,
                phone,
                DOB,
                address,
                image
            },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", student });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
