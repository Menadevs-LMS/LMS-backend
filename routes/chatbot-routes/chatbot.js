const express = require("express");

const { getMessages, sendMessages } = require("../../controllers/chatbot-controller/chatbot-controller");
const authenticate = require("../../middleware/auth-middleware")

const router = express.Router();

router.post("/messages/send", authenticate, sendMessages);
router.get("/messages", authenticate, getMessages);


module.exports = router;