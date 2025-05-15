require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { initialDatabase } = require("./db_connection/db_connection");

const Student = require("./models/student.model");
const Record = require("./models/record.model");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

initialDatabase();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

const getStudentbyEmail = async (email) => {
  try {
    const student = await Student.findOne({ email }).populate("records");
    return student;
  } catch (err) {
    throw err;
  }
};
const getStudentbyID = async (id) => {
  try {
    const student = await Student.findById(id);
    if (student) {
      return student;
    } else {
      return res
        .status(404)
        .json({ message: "No Student with current email ID" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

app.get("/", (req, res) => {
  res.send("Testing");
});

app.post("/student", async (req, res) => {
  try {
    const exsistingStudent = await getStudentbyEmail(req.body.email);
    if (exsistingStudent) {
      return res.status(200).json({
        message: "Signing In",
        student: exsistingStudent,
      });
    }

    const newStudent = new Student(req.body);
    await newStudent.save();
    return res.status(201).json({
      message: "Registration Successful, Please wait Signing In",
      student: newStudent,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", err });
  }
});

app.get("/students", async (req, res) => {
  try {
    const allStudents = await Student.find();
    if (student) {
      res.status(200).json({ message: "fetched successful", allStudents });
    } else {
      res.status(404).json({ message: "No Students available" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", err });
  }
});

app.put("/student/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await student.save();
    const updatedStudent = await getStudentbyID(req.params.id);
    res
      .status(200)
      .json({ message: "Student Details Updated", student: updatedStudent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", err });
  }
});

app.delete("/student/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student Removed from Database" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running   http://localhost:` + PORT);
});
