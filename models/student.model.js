const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
  email: {
    type: String,
    unique: true,
  },
  records: [{ type: mongoose.Schema.ObjectId, ref: "Record" }],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
