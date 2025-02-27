import { Report } from "../Models/report_model.js";
import { Student } from "../Models/student_model.js";
import { Classroom } from "../Models/classRoom_model.js";

// Function to calculate grade based on individual subject score
const getGrade = (score) => {
    if (isNaN(score)) return "Invalid";  // Handle non-numeric score
    if (score >= 80) return "A";  // For example, if the total score >= 80, it's an "A"
    if (score >= 70) return "B";  // Score >= 70, it's a "B"
    if (score >= 60) return "C";  // Score >= 60, it's a "C"
    if (score >= 50) return "D";  // Score >= 50, it's a "D"
    return "F";  // Otherwise, it's an "F"
};

// Function to calculate total score per subject and assign grade
const calculateTotalPerSubject = (firstCA, secondCA, exam) => {
    return firstCA.subjects.map((subject, index) => {
        const firstCAScore = subject.score;
        const secondCAScore = secondCA.subjects[index]?.score || 0;
        const examScore = exam.subjects[index]?.score || 0;

        // Calculate total score for this subject
        const totalScore = firstCAScore + secondCAScore + examScore;

        // Assign grade at the end based on the total score of the subject
        const grade = getGrade(totalScore);

        // Return subject details along with the calculated total score and grade
        return {
            subjectName: subject.subjectName,
            totalScore,  // Total score for this subject
            grade        // Grade assigned based on total score
        };
    });
};

// Create Termly Report for a Student with auto-calculated total and grade
export const createReport = async (req, res) => {
    try {
        const { studentId, classroomId, term, firstCA, secondCA, exam, teacherRemarks } = req.body;

        // Validate the input fields
        if (!studentId || !classroomId || !term || !firstCA || !secondCA || !exam) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the student and classroom to ensure they exist
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Calculate total score and grade for each subject
        const subjectResults = calculateTotalPerSubject(firstCA, secondCA, exam);

        // Calculate the overall total score by summing up subject totals
        const totalScore = subjectResults.reduce((acc, result) => acc + result.totalScore, 0);

        // Calculate the overall grade based on the total score
        const totalGrade = getGrade(totalScore);

        // Create a new Report
        const report = new Report({
            student: studentId,
            classroom: classroomId,
            term,
            firstCA,
            secondCA,
            exam,
            total: totalScore,  // Overall total score
            totalGrade: totalGrade,  // Overall grade
            teacherRemarks,
            subjectResults  // Include individual subject results
        });

        // Save the report
        await report.save();

        res.status(201).json({ message: "Termly report created successfully", report });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update a Single Student's Report by Student ID
export const updateStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { firstCA, secondCA, exam, teacherRemarks } = req.body;

        // Validate that at least one field is provided for update
        if (!firstCA && !secondCA && !exam && !teacherRemarks) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        const report = await Report.findOne({ student: studentId });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Update report fields
        if (firstCA) report.firstCA = firstCA;
        if (secondCA) report.secondCA = secondCA;
        if (exam) report.exam = exam;
        if (teacherRemarks) report.teacherRemarks = teacherRemarks;

        // Recalculate total score and grade for each subject
        const subjectResults = calculateTotalPerSubject(firstCA, secondCA, exam);

        // Recalculate the overall total score by summing up subject totals
        const totalScore = subjectResults.reduce((acc, result) => acc + result.totalScore, 0);

        // Recalculate the overall grade based on the total score
        const totalGrade = getGrade(totalScore);

        report.total = totalScore;  // Update the overall total score
        report.totalGrade = totalGrade;  // Update the overall grade
        report.subjectResults = subjectResults;  // Update subject-wise results

        await report.save();

        res.status(200).json({ message: "Student report updated successfully", report });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get All Reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('student')
            .populate('classroom');

        if (reports.length === 0) {
            return res.status(404).json({ message: "No reports found" });
        }

        res.status(200).json({ reports });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Student Report by Student ID
export const getStudentReportById = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Querying the report by studentId and populating student and classroom
        const report = await Report.findOne({ student: studentId })
            .populate('student')  // Ensure it's correctly populated
            .populate('classroom'); // Ensure it's correctly populated

        // If no report is found, return 404
        if (!report) {
            return res.status(404).json({ message: "Report not found for this student" });
        }

        // Send the found report back in the response
        res.status(200).json({ report });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete All Reports
export const deleteAllReports = async (req, res) => {
    try {
        // Delete all reports from the database
        const result = await Report.deleteMany({});

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No reports found to delete" });
        }

        res.status(200).json({ message: `${result.deletedCount} reports deleted successfully` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a Single Student's Report (only delete the report, not the student)
export const deleteStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params; // Access studentId from route parameters

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        // Find the student by ID to make sure the student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Delete the associated report of the student first
        const report = await Report.findOneAndDelete({ student: studentId });

        if (!report) {
            return res.status(404).json({ message: "Report not found for this student" });
        }

        res.status(200).json({ message: "Student's report successfully deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
