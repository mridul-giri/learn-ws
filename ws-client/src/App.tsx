import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const [msg, setMsg] = useState<any>([]);
  const [sendMsg, setSendMsg] = useState<string>();
  const [roomId, setRoomId] = useState<string>();

  function sendMsgFn() {
    if (!socket) {
      return null;
    }

    console.log("send msg");

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: sendMsg,
        },
      })
    );
  }

  function joinRoom() {
    if (!socket) {
      return null;
    }

    console.log("join room");

    socket.send(
      JSON.stringify({
        type: "join",
        payload: {
          roomId: roomId,
        },
      })
    );
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (e) => {
      setMsg((m: any) => [...m, e.data]);
    };

    return () => {
      socket?.close();
    };
  }, []);

  return (
    <>
      {msg.map((m: string, i: number) => (
        <div key={i}>
          <span>{m}</span>
        </div>
      ))}
      <input
        type="text"
        placeholder="message"
        onChange={(e) => setSendMsg(e.target.value)}
      />
      <button onClick={sendMsgFn}>send Msg</button>
      <input
        type="text"
        placeholder="roomId"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </>
  );
}

export default App;
