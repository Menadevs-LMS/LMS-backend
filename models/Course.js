const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ["multiple-choice", "truth-sentence", "paragraph"],
    default: "multiple-choice"
  },
  options: [String],
  correctAnswer: { type: String },
  truthAnswers: [{ type: String }],
  paragraphAnswer: { type: String }
});

const QuizSchema = new mongoose.Schema({
  title: String,
  questions: [QuestionSchema]
});

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
  pdfUrl: String,
  quiz: QuizSchema,
});





const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image: String,
  welcomeMessage: String,
  objectives: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [LectureSchema],
  quiz: QuizSchema,
  isPublised: Boolean,
})

module.exports = mongoose.model("Course", CourseSchema);
