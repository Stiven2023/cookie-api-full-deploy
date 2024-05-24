import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
export const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected from:", socket.handshake.headers.host);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});