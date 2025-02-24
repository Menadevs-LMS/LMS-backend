require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/aws-media");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const chatbotRoutes = require("./routes/chatbot-routes/chatbot");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb is connected"))
  .catch((e) => console.log(e));

//routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use(chatbotRoutes);


app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});
// app.get("/api/messages",authenticate, async (req, res) => {
//   try {
//     const messages = await Message.find({ userId: req.user._id }).sort({ createdAt: 1 });
//     const formattedMessages = messages.map(msg => ({
//       message: msg.message,
//       sender: msg.sender,
//       direction: msg.sender === 'user' ? 'outgoing' : 'incoming'
//     }));
//     res.json(formattedMessages);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// });

// app.post("/api/messages/send",authenticate, async (req, res) => {
//   const { message } = req.body;

//   try {
//     const userId = req.user._id;

//     const userMessage = new Message({ userId, message, sender: "user" });
//     await userMessage.save();

//     const messages = await Message.find({ userId }).sort({ createdAt: 1 });

//     const apiMessages = messages.map((msg) => ({
//       role: msg.sender === "user" ? "user" : "assistant",
//       content: msg.message,
//     }));

//     apiMessages.unshift({ role: "system", content: "Explain like you're talking to a software professional with 2 years of experience." });

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: apiMessages,
//     });

//     const aiMessage = response.choices[0].message.content;
//     const chatGPTMessage = new Message({ userId, message: aiMessage, sender: "ChatGPT" });
//     await chatGPTMessage.save();

//     res.json({ response: aiMessage });
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
