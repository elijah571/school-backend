import bcryptjs from 'bcryptjs';
import { Administrative } from '../Models/administative.js';
import { generateToken } from '../Utils/generateToken.js';

// Create Admin
export const createAdmin = async (req, res) => {
    const { name, email, password } = req.fields;
    const image = req.files?.image ? req.files.image.path : null;

    try {
        // Check for required fields
        if (!name || !email || !password || !image) {
            return res.status(400).json({ message: "All fields are required to be filled" });
        }

        // Check if user already exists
        const userExist = await Administrative.findOne({ email }).select('_id');
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashPassword = await bcryptjs.hash(password, 10);

        // Create new admin
        const admin = new Administrative({
            name,
            email,
            password: hashPassword,
            isAdmin: true,
            image // Store image file path
        });

        // Save admin to DB
        await admin.save();

        res.status(201).json({
          admin
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Logged In Admin

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user from DB
        const user = await Administrative.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        // Compare password
        const isCorrectPassword = await bcryptjs.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Login is successful, generate token
        generateToken(res, { id: user._id });

        return res.status(200).json({
            message: "Login successful",
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
// LogOut admin
export const logoutAdmin = async (req, res) => {
    // Clear the authentication cookie (adjust 'token' to your actual cookie name)
    res.clearCookie('token');

    return res.status(200).json({
        message: "Admin logged out successfully"
    });
};
//update user

export const updateAdmin = async (req, res) => {
    try {
        const admin = await Administrative.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Update fields with checks
        if (req.body.name) {
            admin.name = req.body.name;
        }
        if (req.body.email) {
            admin.email = req.body.email;
        }
        if (req.body.isAdmin !== undefined) {
            admin.isAdmin = Boolean(req.body.isAdmin);
        }

        // Save the updated admin
        await admin.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                image: admin.image || null,  
                isAdmin: admin.isAdmin
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
