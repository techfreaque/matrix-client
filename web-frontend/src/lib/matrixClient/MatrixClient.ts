"use client";

import {
  AuthType,
  createClient,
  EventType,
  ISendEventResponse,
  MatrixClient,
  MsgType,
  RoomEvent,
  RoomState,
  RoomStateEvent,
} from "matrix-js-sdk";

let matrixClient: MatrixClient;

export const initializeMatrixClient = (baseUrl: string) => {
  matrixClient = createClient({
    baseUrl,

    // accessToken: myAccessToken,
    // userId: myUserId,
  });
  return matrixClient;
};

export const registerMatrixUser = async (
  username: string,
  password: string,
) => {
  if (!matrixClient) {
    throw new Error("Matrix client is not initialized!");
  }

  try {
    const registerResponse = await matrixClient.registerRequest({
      username,
      password,
      auth: {
        // type: "m.login.dummy",
        type: AuthType.Password,
      },
    });

    matrixClient.startClient();
    return registerResponse;
  } catch (error) {
    console.error("Registration failed: ", error);
    throw error;
  }
};

export const loginToMatrix = async (username: string, password: string) => {
  if (!matrixClient) {
    throw new Error("Matrix client is not initialized!");
  }

  try {
    const response = await matrixClient.login("m.login.password", {
      user: username,
      password,
    });
    matrixClient.startClient({ lazyLoadMembers: true });
    return response;
  } catch (error) {
    console.error("Login failed: ", error);
    throw error;
  }
};

export const getRooms = () => {
  if (!matrixClient) {
    throw new Error("Matrix client is not initialized!");
  }
  return matrixClient.getRooms();
};

export const getRoomMessages = (
  roomId: string,
  onNewMessage: (roomState: RoomState) => void,
) => {
  if (!matrixClient) {
    throw new Error("Matrix client is not initialized!");
  }

  const room = matrixClient.getRoom(roomId);
  if (!room) {
    throw new Error(`Room with id ${roomId} not found!`);
  }

  // Register event listener for new messages
  matrixClient.on(RoomStateEvent.Update, (roomState: RoomState) => {
    onNewMessage(roomState);
  });

  // Load initial timeline
  const timeline = room.getLiveTimeline().getEvents();
  // return timeline.map((event) => event.event);
  return timeline;
};

export const sendMessage = async (
  roomId: string,
  message: string,
): Promise<ISendEventResponse> => {
  if (!matrixClient) {
    throw new Error("Matrix client is not initialized!");
  }
  try {
    const response = await matrixClient.sendEvent(
      roomId,
      EventType.RoomMessage,
      {
        msgtype: MsgType.Text,
        body: message,
      },
    );
    return response;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

// event example
// const matrixClient = create<MatrixClientType>((set) => ({
//   sendCustomEvent: async (eventType: string, content: object) => {
//     set((state) => {
//       const client = state.client;
//       if (client) {
//         const roomId = "!your_room_id_here"; // Replace with your target room ID

//         // Send a custom event to the specified room
//         client
//           .sendEvent(roomId, eventType, content)
//           .then(() => {
//             console.log("Event sent successfully");
//           })
//           .catch((err) => {
//             console.error("Failed to send event:", err);
//           });
//       }
//     });
//   },
//   fetchCustomEvents: async () => {
//     set((state) => {
//       const client = state.client;
//       if (client) {
//         const roomId = "!your_room_id_here"; // Replace with your target room ID

//         // Fetch the state of the room
//         return client
//           .getRoom(roomId)
//           ?.getStateEvents("com.example.theme", "")
//           .then((event) => {
//             return event?.getContent();
//           })
//           .catch((err) => {
//             console.error("Failed to fetch events:", err);
//             return null;
//           });
//       }
//     });
//   },
// }));
