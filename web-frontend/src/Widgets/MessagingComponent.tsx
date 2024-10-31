import React, { useState, useEffect } from "react";
import { sendMessage } from "../lib/matrixClient/MatrixClient";
import { MatrixClient, MatrixEvent, RoomEvent } from "matrix-js-sdk";

const MessageRoom = ({
  roomId,
  client,
}: {
  roomId: string;
  client: MatrixClient | undefined;
}) => {
  const [message, setMessage] = useState("");

  const { messages, setMessages } = useRoomMessages(client, roomId);

  const handleSendMessage = async () => {
    await sendMessage(roomId, message);
    setMessage("");
  };

  return (
    <div>
      <div>
        <h3>Room: {roomId}</h3>
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.event.event_id}>
              <strong>{msg.sender.name}:</strong> {msg.getContent().body}
            </div>
          ))}
        </div>
        <div style={{ position: "fixed", bottom: "0" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default MessageRoom;

function useRoomMessages(
  client: MatrixClient | undefined,
  roomId: string,
): {
  messages: MatrixEvent[];
  setMessages: React.Dispatch<React.SetStateAction<MatrixEvent[]>>;
} {
  const [messages, setMessages] = useState<MatrixEvent[]>([]);
  useEffect(() => {
    if (client) {
      const room = client.getRoom(roomId);
      room && setMessages(room.getLiveTimeline().getEvents());

      const onMessage = (event: MatrixEvent) => {
        if (event.getRoomId() === roomId) {
          setMessages((prevMessages) => [...prevMessages, event]);
        }
      };

      client.on(RoomEvent.Timeline, onMessage);
      return () => client.off(RoomEvent.Timeline, onMessage);
    }
    return () => {};
  }, [client, roomId]);
  return { messages, setMessages };
}
