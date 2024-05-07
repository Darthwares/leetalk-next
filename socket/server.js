const PORT = process.env.PORT || 5555;

const HOSTED_URL =
  process.env.NODE_ENV === "production"
    ? "https://leetalk-next.vercel.app/"
    : "http://localhost:3000";

const io = require("socket.io")(PORT, {
  cors: {
    origin: "https://leetalk-next.vercel.app:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on(
    "message",
    (messageContent, senderName, conversationId, messageId, time) => {
      const messageData = {
        message_text: messageContent,
        sender: senderName,
        conversation_id: conversationId,
        message_id: messageId,
        created_at: time,
      };
      console.log(messageData); // Log the received object
      io.emit("message", messageData); // Emit the object to all clients
    }
  );
});

console.log("server running on port 3000", process.env.PORT);
