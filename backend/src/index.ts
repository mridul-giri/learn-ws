import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSocket: User[] = [];

wss.on("connection", function (socket) {
  socket.on("message", (msg) => {
    const parsedMsg = JSON.parse(msg as unknown as string);
    if (parsedMsg.type === "join") {
      allSocket.push({ socket, room: parsedMsg.payload.roomId });
    }

    if (parsedMsg.type === "chat") {
      const currUserRoom = allSocket.find((u) => u.socket == socket)?.room;

      allSocket.forEach((u) => {
        if (u.room == currUserRoom) {
          u.socket.send(parsedMsg.payload.message);
        }
      });
    }
  });
});
