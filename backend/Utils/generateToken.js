import jwt from "jsonwebtoken";

export const generateToken = (res, { id }) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
};
