const Message = require("../../models/Message");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ userId: req.user._id }).sort({ createdAt: 1 });
        const formattedMessages = messages.map(msg => ({
            message: msg.message,
            sender: msg.sender,
            direction: msg.sender === 'user' ? 'outgoing' : 'incoming'
        }));
        res.json(formattedMessages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

const sendMessages = async (req, res) => {
    const { message } = req.body;

    try {
        const userId = req.user._id;

        const userMessage = new Message({ userId, message, sender: "user" });
        await userMessage.save();

        const messages = await Message.find({ userId }).sort({ createdAt: 1 });

        const apiMessages = messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.message,
        }));

        apiMessages.unshift({ role: "system", content: "Explain like you're talking to a software professional with 2 years of experience." });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: apiMessages,
        });

        const aiMessage = response.choices[0].message.content;
        const chatGPTMessage = new Message({ userId, message: aiMessage, sender: "ChatGPT" });
        await chatGPTMessage.save();

        res.json({ response: aiMessage });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};



module.exports = {
    sendMessages,
    getMessages,
};
