import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import uploadRoute from "./Routes/uploadRoute.js";
import { connectDB } from "./Database/connectDB.js";
import path from "path";

// Routes
import { adminRoute } from "./Routes/administrative_route.js";
import { classRoomRoute } from "./Routes/classRoom_route.js";
import { teachers_route } from "./Routes/teachers_route.js";
import { student_route } from "./Routes/student_route.js";
import { attendanceRoute } from "./Routes/attendanve_route.js";
import { reportRoute } from "./Routes/report_route.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//cors
const allowedOrigins = [
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// API Routes
app.use("/api/admin", adminRoute);
app.use("/api/class-room", classRoomRoute);
app.use("/api/teacher", teachers_route);
app.use("/api/student", student_route);
app.use("/api/attendance", attendanceRoute);
app.use("/api/report", reportRoute);
app.use("/api/upload", uploadRoute);

// Serve static files from the uploads folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "API", "uploads")));

app.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
});
